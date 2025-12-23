
import { ActivityLog, ActivityLogCreationAttributes } from "../models/activityLogs.js";

export class ActivityLogRepository {
    async create(data: ActivityLogCreationAttributes) {
        return ActivityLog.create(data);
    }

    async findById(id: number) {
        return ActivityLog.findByPk(id);
    }

    async findByTaskId(task_id: number) {
        return ActivityLog.findAll({ where: { task_id } });
    }

    async findAll() {
        return ActivityLog.findAll();
    }
}

export const activityLogRepo = new ActivityLogRepository();
