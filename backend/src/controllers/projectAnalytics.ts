import { Request, Response } from "express";
import { taskRepo } from "../repositories/task.repository.js";
import { activityLogRepo } from "../repositories/activityLog.repository.js";
import { projectRepo } from "../repositories/project.repository.js";
import { ActivityLog } from "../models/activityLogs.js";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";

/**
 * @Description Get analytics and overview data for a project
 * @Route GET /api/project/analytics/:projectId
 * @Access Private
 */
export const getProjectAnalytics = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    try {
        // 1. Check if project exists
        const project = await projectRepo.findById(Number(projectId));
        if (!project) {
            return res.status(404).json({
                status: false,
                msg: "Project not found"
            });
        }

        // 2. Get task stats (Status & Priority)
        const taskStats = await taskRepo.getTaskStatsByProject(Number(projectId));

        // 3. Get recent activity logs for this project
        // We fetch logs belonging to tasks in this project
        const recentLogs = await ActivityLog.findAll({
            include: [
                {
                    model: Task,
                    as: 'task',
                    where: { project_id: Number(projectId) },
                    attributes: ['title']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: 20
        });

        // 4. Calculate progress percentage
        const progress = taskStats.totalTasks > 0
            ? Math.round((taskStats.statusCounts.DONE / taskStats.totalTasks) * 100)
            : 0;

        return res.status(200).json({
            status: true,
            msg: "Project analytics fetched successfully",
            data: {
                project,
                stats: {
                    ...taskStats,
                    progress
                },
                recentActivity: recentLogs
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};
