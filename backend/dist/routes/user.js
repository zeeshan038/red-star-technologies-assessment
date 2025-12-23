//NPM Packages
import express from "express";
const router = express.Router();
//Controllers
import { loginUser, registerUser, searchUsers } from "../controllers/user.js";
import { verifyUser } from "../middlewares/verifyUser.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", verifyUser, searchUsers);
export default router;
