import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { userRepo } from "../repositories/user.repository.js";
export const verifyUser = async (req, res, next) => {
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")) {
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
        const decoded = jwt.verify(token, secret);
        const user = await userRepo.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: false,
                msg: "User not found or token invalid",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            status: false,
            msg: "Not authorized, token verification failed",
            error: error.message,
        });
    }
};
