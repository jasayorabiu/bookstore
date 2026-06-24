import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as otpauth from "otpauth";
import QRCode from "qrcode";
import { randomBytes } from "crypto";

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
    const recoverCode = user?.recoverCode;
    const hassedRecoverCode = await bcrypt.hash(recoverCode!, 10);
    await prisma.user.update({
        where: { id: userId },
        data: {
            twoFactorSecret: secret.base32,
            isTwoFactorEnabled: true,
            recoverCode: hassedRecoverCode
        }
    });
    return { user, qrCodeDataUrl };
};

const verifyTwoFactorCode = async (userId: number, code: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user || !user.twoFactorSecret) {
        throw new Error("Two-factor authentication is not enabled for this user.");
    }
    const totp = new otpauth.TOTP({
        issuer: 'Bookstore',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: user.twoFactorSecret
    });
    const validate = totp.validate({ token: code, window: 1 });
    if (!validate) {
        throw new Error("Invalid two-factor authentication code.");
    }
    const token = jwt.sign({ id: user.id }, SECRETKEY, { expiresIn: '1h' });
    const recoverCode = user.recoverCode;
    await prisma.session.create({
        data: {
            userId: user.id,
            token: token,
            expiresAt: new Date(Date.now() + 3600000),  // 1 hour from now
            isActive: true
        }

    });

    return { user, token, recoverCode };
}


const getUsers = async () => {
    return prisma.user.findMany();
}
const getUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    });
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
    return { user, token };
}
const signInUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
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
    return null;
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

const authservices = { getUsers, getUserById, createUser, updateUser, deleteUser, signInUser, signOutUser , enableTwoFactorAuth, verifyTwoFactorCode};
export default authservices;