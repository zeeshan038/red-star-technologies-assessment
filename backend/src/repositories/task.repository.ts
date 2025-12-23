
import { Task, TaskCreationAttributes } from "../models/task";

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

    async delete(id: number) {
        return Task.destroy({ where: { id } });
    }
}

export const taskRepo = new TaskRepository();
