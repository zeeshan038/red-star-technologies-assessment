import express from "express";
const router = express.Router();

import user from "./user";
import workspace from "./workspace";
import project from './project';
import task from './task';

router.use("/user", user);
router.use("/workspace", workspace);
router.use("/project", project);
router.use("/task", task);

export default router;
