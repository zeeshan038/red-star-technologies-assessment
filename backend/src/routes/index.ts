import express from "express";
const router = express.Router();

import user from "./user";
import workspace from "./workspace";
import project from './project';
import task from './task';
import activityLog from './activityLog';

router.use("/user", user);
router.use("/workspace", workspace);
router.use("/project", project);
router.use("/task", task);
router.use("/logs", activityLog);

export default router;
