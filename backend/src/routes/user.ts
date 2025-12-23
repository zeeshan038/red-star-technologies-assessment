//NPM Packages
import express from "express";
const router = express.Router();

//Controllers
import { loginUser, registerUser, searchUsers } from "../controllers/user";
import { verifyUser } from "../middlewares/verifyUser";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", verifyUser, searchUsers);

export default router;
