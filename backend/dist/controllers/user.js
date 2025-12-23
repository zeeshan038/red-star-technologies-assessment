import bcrypt from "bcryptjs";
//Repositories
import { userRepo } from "../repositories/user.repository.js";
//Schemas
import { loginSchemma, userSchema } from "../schema/User.js";
//utils
import { genrateToken } from "../utils/Methods.js";
/**
 * @Description Register a new user
 * @Route POST /api/user/register
 * @Access Public
 */
export const registerUser = async (req, res) => {
    const payload = req.body;
    const result = userSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }
    try {
        const existingUser = await userRepo.findByEmail(payload.email);
        if (existingUser) {
            return res.status(400).json({
                status: false,
                msg: "User already exists"
            });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(payload.password, salt);
        const user = await userRepo.create({
            name: payload.name,
            email: payload.email,
            password: hashedPassword
        });
        const token = genrateToken(user.id);
        return res.status(201).json({
            status: true,
            msg: "User registered successfully",
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};
/**
 * @description Login user
 * @route POST /api/user/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    const payload = req.body;
    const result = loginSchemma(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }
    try {
        const user = await userRepo.findByEmail(payload.email);
        if (!user) {
            return res.status(400).json({
                status: false,
                msg: "User not found"
            });
        }
        const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                status: false,
                msg: "Invalid password"
            });
        }
        const token = genrateToken(user.id);
        return res.status(200).json({
            status: true,
            msg: "User logged in successfully",
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};
/**
 * @description Search users by name or email
 * @route GET /api/user/search
 * @access Private
 */
export const searchUsers = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({
            status: false,
            msg: "Query parameter is required"
        });
    }
    try {
        const users = await userRepo.search(query);
        return res.status(200).json({
            status: true,
            msg: "Users fetched successfully",
            data: users
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};
