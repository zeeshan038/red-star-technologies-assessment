import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const genrateToken = (id: number) => {
    const secret = process.env.JWT_SECRET || "default_secret";
    console.log(`[Token Gen] Using secret starting with: ${secret.substring(0, 4)}...`);
    return jwt.sign({ id }, secret);
};