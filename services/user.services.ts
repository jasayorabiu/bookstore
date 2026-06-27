import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as otpauth from "otpauth";
import QRCode from "qrcode";
import { randomBytes } from "crypto";
import { error } from "console";
import sendEmail from "../lib/mail";
import { Session } from "inspector";

const generateTwoFactorSecret = (count = 8): string[] => {

    return Array.from({ length: count }, () =>
        randomBytes(1).toString('hex').toUpperCase()
    );
};


const SECRETKEY = process.env.JWT_SECRET || "your_jwt_secret_here";

const enableTwoFactorAuth = async (userId: number) => {
    const secret = new otpauth.Secret({ size: 20 })
    const user = await prisma.user.findFirst({
        where: { id: userId },


    });
    const otpauthUrl = new otpauth.TOTP({
        issuer: 'Bookstore',
        label: user?.email || "User",
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
    })
    const otpauthUrlString = otpauthUrl.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrlString);
    const recoverCode = generateTwoFactorSecret(8).join('-');
    const hassedRecoverCode = await bcrypt.hash(recoverCode!, 10);
    await prisma.user.update({
        where: { id: userId },
        data: {
            twoFactorSecret: secret.base32,
            isTwoFactorEnabled: true,
            recoverCode: hassedRecoverCode
        }
    });
    return { user, qrCodeDataUrl,otpauthUrlString };
};

const verifyTwoFactorCode = async (userId: number, code: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    console.log(user)
    if (!user || !user.isTwoFactorEnabled) {
        throw new Error("Two-factor authentication is not enabled for this user.");
    }
    const totp = new otpauth.TOTP({
        issuer: 'Bookstore',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: user.twoFactorSecret ?? undefined
    });
    const validate = totp.validate({ token: code, window: 1 });
   if (validate === null) {
        throw new Error("Invalid two-factor authentication code.");
    }
    
    const token = jwt.sign({ id: user.id }, SECRETKEY, { expiresIn: '1h' });
    const recoverCode = user.recoverCode;
    await prisma.session.create({
        data: {
            userId: user.id,
            token: token,
            isActive: true
        }

    });
    

    return { user, token, recoverCode };
}


const getUsers = async () => {
    const result = await prisma.user.findMany();
    return result
}
const getUserById = async (id: number) => {
    const result = await prisma.user.findMany({
        where: {
            id: Number(id)
        }
    });
     return result;
}
const createUser = async (name: string, email: string, password: string) => {
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: await bcrypt.hash(password, 10)
        }
    });
    const token = jwt.sign({ id: user.id }, SECRETKEY, { expiresIn: '1h' });
    await sendEmail( email, "Registration",`Welcome ${name}, you have joined us`)
    return { user, token };
}
const signInUser = async (email: string, password: string) => {
    try {

        const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (user && user.isTwoFactorEnabled) {
        return { user, twoFactorRequired: true , token: null};
    }

    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRETKEY, { expiresIn: '1h' });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: token,
                expiresAt: new Date(Date.now() + 3600000),  // 1 hour from now
                isActive: true
            }

        });
        return { user, token };
    }
    
    } catch (error) {
        console.log(error)
    }
    
}

const forgottenPassword = async (email : string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
              email,
            },
        });
        if (!user) {
            throw new Error("user not found");
        }
        const resetToken = jwt.sign({ userId: user.id }, SECRETKEY, {
            expiresIn: "1h"
        });
        return resetToken;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const resetPassword = async (token: string, newPassword : string) => {
    try {
        const decoded : any = jwt.verify(token, SECRETKEY)
        const userId = decoded.userId;
        const hassedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: {id : userId },
            data: {password : hassedPassword}
        });
        return true
    } catch (error) {
        console.log(error);
        throw error
    }
}

const logOut = async (userId : number, token : string, logOutAllDevice? : boolean)  => { 
    try {
        await prisma.session.deleteMany({
            where : {
                userId : userId,
                token : logOutAllDevice ? undefined : token,
            }
        })
        const userSession = await prisma.session.findMany({
            where : {
                userId,

            }
        })
        if(logOutAllDevice){
            userSession.forEach(async(session) => {
                await prisma.blacklist.create({
                    data : {
                      token : session.token,
                      createdAt : session.createdAt  
                    }
                })
            }) 
        } else {
            await prisma.blacklist.create({
                data : {
                    token,
                    refreshToken : token,
                    createdAt : new Date(Date.now() + 7 * 24)
                }
            })
        }
    } catch (error) {
        console.log("failled to logOut")
    }

}

const signOutUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (user) {
        await prisma.session.deleteMany({
            where: {
                userId: userId
            }
        });
        await prisma.blacklist.create({
            data: {
                token: userId.toString()
            }
        });
    }
    return true;
}

const updateUser = async (id: number, name: string, email: string, password: string) => {
    const data: any = { name, email };
    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    return await prisma.user.update({
        where: { id },
        data
    });
}
const deleteUser = async (id: number) => {
    return await prisma.user.delete({
        where: {
            id: id
        }
    });
}

const authservices = { getUsers, getUserById, createUser, updateUser, deleteUser, signInUser, signOutUser , enableTwoFactorAuth, verifyTwoFactorCode,resetPassword,forgottenPassword};
export default authservices;