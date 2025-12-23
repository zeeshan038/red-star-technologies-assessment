
import { Task, TaskCreationAttributes } from "../models/task.js";

export class TaskRepository {
    async create(data: TaskCreationAttributes) {
        return Task.create(data);
    }

    async findById(id: number) {
        return Task.findByPk(id);
    }

    async findByProjectId(project_id: number) {
        return Task.findAll({ where: { project_id } });
    }

    async findAll(filters?: any) {
        if (filters) {
            return Task.findAll({ where: filters });
        }
        return Task.findAll();
    }

    async update(id: number, data: Partial<TaskCreationAttributes>) {
        const task = await this.findById(id);
        if (!task) {
            return null;
        }
        return task.update(data);
    }

    async getTaskStatsByProject(project_id: number) {
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

    async delete(id: number) {
        return Task.destroy({ where: { id } });
    }
}

export const taskRepo = new TaskRepository();
