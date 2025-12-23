import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { userRepo } from "../repositories/user.repository.js";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

interface JwtPayload {
    id: number;
}

export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            status: false,
            msg: "Not authorized, no token provided",
        });
    }

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1]?.trim();

        if (!token) {
            console.error("JWT Error: Token is empty after split");
            return res.status(401).json({
                status: false,
                msg: "Not authorized, token missing or malformed",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT Error: JWT_SECRET is missing in environment");
            return res.status(500).json({ status: false, msg: "Server configuration error" });
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        const user = await userRepo.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: false,
                msg: "User not found or token invalid",
            });
        }

        req.user = user;
        next();
    } catch (error: any) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            status: false,
            msg: "Not authorized, token verification failed",
            error: error.message,
        });
    }
};
