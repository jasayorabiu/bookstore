import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const SECRETKEY = process.env.JWT_SECRET || "your_jwt_secret_here";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        (req as any).user = user; // Attach user info to request object
        next();
    });
};

export default authenticateToken;