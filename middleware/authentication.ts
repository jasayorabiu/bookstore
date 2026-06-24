import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const SECRETKEY = process.env.JWT_SECRET || "your_jwt_secret_here";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    const userSession = await prisma.session.findFirst({
        where: {
            token: token,
            isActive: true
        }
    });

    if (!userSession) {
        return res.status(403).json({ message: "Invalid or expired access token" });
    }

    jwt.verify(token, SECRETKEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        (req as any).user = user; // Attach user info to request object
        next();
    });
};

export default authenticateToken;