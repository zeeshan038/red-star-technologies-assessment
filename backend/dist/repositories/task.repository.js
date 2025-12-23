import { Task } from "../models/task.js";
export class TaskRepository {
    async create(data) {
        return Task.create(data);
    }
    async findById(id) {
        return Task.findByPk(id);
    }
    async findByProjectId(project_id) {
        return Task.findAll({ where: { project_id } });
    }
    async findAll(filters) {
        if (filters) {
            return Task.findAll({ where: filters });
        }
        return Task.findAll();
    }
    async update(id, data) {
        const task = await this.findById(id);
        if (!task) {
            return null;
        }
        return task.update(data);
    }
    async getTaskStatsByProject(project_id) {
        const tasks = await Task.findAll({
            where: { project_id },
            attributes: ['status', 'priority']
        });
        const stats = {
            totalTasks: tasks.length,
            statusCounts: {
                TODO: 0,
                IN_PROGRESS: 0,
                DONE: 0
            },
            priorityCounts: {
                LOW: 0,
                MEDIUM: 0,
                HIGH: 0
            }
        };
        tasks.forEach(task => {
            if (stats.statusCounts[task.status] !== undefined) {
                stats.statusCounts[task.status]++;
            }
            if (stats.priorityCounts[task.priority] !== undefined) {
                stats.priorityCounts[task.priority]++;
            }
        });
        return stats;
    }
    async delete(id) {
        return Task.destroy({ where: { id } });
    }
}
export const taskRepo = new TaskRepository();
