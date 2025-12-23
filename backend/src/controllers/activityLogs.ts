import { Request, Response } from "express";
import { activityLogRepo } from "../repositories/activityLog.repository.js";

/**
 * @Description Get all activity logs
 * @Route GET /api/activity-log
 * @Access Private
 */
export const getAllActivityLogs = async (req: Request, res: Response) => {
    try {
        const logs = await activityLogRepo.findAll();
        return res.status(200).json({
            status: true,
            msg: "Activity logs fetched successfully",
            data: logs
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};