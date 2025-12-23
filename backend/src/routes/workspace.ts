import express from "express";
import {
    createWorkspace,
    getWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMemberToWorkspace,
    getWorkspaceMembers
} from "../controllers/workspace";
import { verifyUser } from "../middlewares/verifyUser";

const router = express.Router();

router.use(verifyUser);

router.post("/create", createWorkspace);
router.get("/all", getWorkspaces);
router.get("/:id", getWorkspace);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.post("/add-member/:workspaceId/:memberId", addMemberToWorkspace);
router.get("/members/:workspaceId", getWorkspaceMembers);

export default router;
