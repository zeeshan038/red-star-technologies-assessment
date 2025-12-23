import express from "express";
const router = express.Router();
import { getAllActivityLogs } from "../controllers/activityLogs.js";
import { verifyUser } from "../middlewares/verifyUser.js";
router.use(verifyUser);
router.get("/all", getAllActivityLogs);
export default router;
