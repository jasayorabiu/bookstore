import {prisma} from "../lib/prisma";
import {Request, Response} from "express";
import bcrypt from "bcrypt";
import {getUsers as getAllUsers, getUserById as getSingleUser, createUser, updateUser, deleteUser, signInUser, signOutUser} from "../services/user.services";
const getUsers = async (req: Request, res: Response) => {
    try {
    const users = await getAllUsers();
    res.json({ message: "Users retrieved successfully", data: users });
} catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
}
}
const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await getSingleUser(Number(id));
    if (user) {
        res.json({ message: "User retrieved successfully", data: user });
    } else {
        res.status(404).json({ message: "User not found" });
    }
}
const addUser = async (req: Request, res: Response) => {
try { 

    const {name, email, password} = req.body;
   const user = await createUser(name, email, password);
   res.json({ message: "User created successfully", data: user });
} catch (error) {
    res.status(500).json({ message: "Error creating user", error });
}
}

const logInUsers = async (req: Request, res: Response) => {
    try {
            const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }
    return null;
} catch (error) {
    res.status(500).json({ message: "Error signing in user", error });
}
    }


const logOutUsers = async (req: Request, res: Response) => {
    const userId = req.params.id;
    return true;
}

const updateUsers = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {name, email, password} = req.body;
    return await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            email,
            password
        }
    });
}
const deleteUsers = async (req: Request, res: Response) => {
    const id = req.params.id;
    return await prisma.user.delete({
        where: {
            id: Number(id)
        }
    });
}

export {getUsers, getUserById, addUser, updateUsers, deleteUsers, logInUsers, logOutUsers}
