import express from "express";
const router = express.Router();

import {
    createProject,
    getWorkspaceProjects,
    deleteProject,
    getProject
} from "../controllers/project";
import { verifyUser } from "../middlewares/verifyUser";

router.use(verifyUser)

router.post("/create/:workspaceId", createProject);
router.get("/all/:workspaceId", getWorkspaceProjects);
router.get("/:projectId", getProject);
router.delete("/delete/:projectId", deleteProject);


export default router;