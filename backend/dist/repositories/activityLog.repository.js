import { ActivityLog } from "../models/activityLogs.js";
export class ActivityLogRepository {
    async create(data) {
        return ActivityLog.create(data);
    }
    async findById(id) {
        return ActivityLog.findByPk(id);
    }
    async findByTaskId(task_id) {
        return ActivityLog.findAll({ where: { task_id } });
    }
    async findAll() {
        return ActivityLog.findAll();
    }
}
export const activityLogRepo = new ActivityLogRepository();
