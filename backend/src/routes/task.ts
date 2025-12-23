import express from "express";
const router = express.Router();

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskLogs,
    toggleTaskStatus
} from "../controllers/task";

import { verifyUser } from "../middlewares/verifyUser";

router.use(verifyUser)

router.post("/create/:projectId", createTask);
router.get("/all", getTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/logs/:id", getTaskLogs);
router.patch("/status/:id", toggleTaskStatus);


export default router;