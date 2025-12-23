import express from "express";
const router = express.Router();

import { getAllActivityLogs } from "../controllers/activityLogs";
import { verifyUser } from "../middlewares/verifyUser";

router.use(verifyUser);

router.get("/all", getAllActivityLogs);

export default router;
