import {prisma} from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRETKEY = process.env.JWT_SECRET || "your_jwt_secret_here";
const getUsers = async () => {
    return  prisma.user.findMany();
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
        return { user, token };
    }
    return null;
}

const signOutUser = async (userId: number) => {
    
    return true;
}

const updateUser = async (id: number, name: string, email: string, password: string) => {
    return await prisma.user.update({
        where: {
            id: id
        },
        data: {
            name,
            email,
            password
        }
    });
}
const deleteUser = async (id: number) => {
    return await prisma.user.delete({
        where: {
            id: id
        }
    });
}

export {getUsers, getUserById, createUser, updateUser, deleteUser, signInUser, signOutUser}