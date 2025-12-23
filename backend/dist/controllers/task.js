import { taskSchema } from "../schema/Task.js";
// Repositories
import { taskRepo } from "../repositories/task.repository.js";
import { activityLogRepo } from "../repositories/activityLog.repository.js";
/**
 * @Description Create a new task
 * @Route POST /api/task/create
 * @Access Private
 */
export const createTask = async (req, res) => {
    const { projectId } = req.params;
    const payload = req.body;
    const result = taskSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }
    try {
        const task = await taskRepo.create({
            ...payload,
            project_id: Number(projectId),
        });
        // Log activity
        await activityLogRepo.create({
            task_id: task.id,
            user_id: Number(req.user?.id),
            action: "CREATED"
        });
        return res.status(201).json({
            status: true,
            msg: "Task created successfully",
            data: task
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
 * @Description Get tasks with optional filters
 * @Route GET /api/task/all
 * @Access Private
 */
export const getTasks = async (req, res) => {
    const { projectId, status, assigned_to } = req.query;
    try {
        const whereClause = {};
        if (projectId) {
            whereClause.project_id = projectId;
        }
        if (status) {
            whereClause.status = status;
        }
        if (assigned_to) {
            whereClause.assigned_to = assigned_to;
        }
        const tasks = await taskRepo.findAll(whereClause);
        return res.status(200).json({
            status: true,
            msg: "Tasks fetched successfully",
            data: tasks
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
 * @Description Update a task
 * @Route PATCH /api/task/:id
 * @Access Private
 */
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = taskSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }
    try {
        const task = await taskRepo.findById(Number(id));
        if (!task) {
            return res.status(404).json({
                status: false,
                msg: "Task not found"
            });
        }
        await taskRepo.update(Number(id), payload);
        // Log activity
        let action = "UPDATED";
        if (payload.assigned_to) {
            action = "ASSIGNED";
        }
        else if (payload.status) {
            action = `STATUS_CHANGED_${payload.status}`;
        }
        await activityLogRepo.create({
            task_id: Number(id),
            user_id: Number(req.user?.id),
            action: action
        });
        // Fetch updated task to return
        const updatedTask = await taskRepo.findById(Number(id));
        return res.status(200).json({
            status: true,
            msg: "Task updated successfully",
            data: updatedTask
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
 * @Description Delete a task
 * @Route DELETE /api/task/:id
 * @Access Private
 */
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskRepo.findById(Number(id));
        if (!task) {
            return res.status(404).json({
                status: false,
                msg: "Task not found"
            });
        }
        await taskRepo.delete(Number(id));
        // Log activity
        await activityLogRepo.create({
            task_id: Number(id),
            user_id: Number(req.user?.id),
            action: "DELETED"
        });
        return res.status(200).json({
            status: true,
            msg: "Task deleted successfully"
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
 * @Description task logs
 * @Route GET /api/task/logs/:id
 * @Access Private
 */
export const getTaskLogs = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskRepo.findById(Number(id));
        if (!task) {
            return res.status(404).json({
                status: false,
                msg: "Task not found"
            });
        }
        const logs = await activityLogRepo.findByTaskId(Number(id));
        return res.status(200).json({
            status: true,
            msg: "Task logs fetched successfully",
            data: logs
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
 * @Description toggle task status
 * @Route PATCH /api/task/:id
 * @Access Private
 */
export const toggleTaskStatus = async (req, res) => {
    const { status } = req.body;
    console.log("status", status);
    const { id } = req.params;
    try {
        const task = await taskRepo.findById(Number(id));
        if (!task) {
            return res.status(404).json({
                status: false,
                msg: "Task not found"
            });
        }
        await taskRepo.update(Number(id), { status: status });
        // Log activity
        await activityLogRepo.create({
            task_id: Number(id),
            user_id: Number(req.user?.id),
            action: `STATUS_CHANGED_${status}`
        });
        const updatedTask = await taskRepo.findById(Number(id));
        return res.status(200).json({
            status: true,
            msg: "Task status toggled successfully",
            data: updatedTask
        });
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};
