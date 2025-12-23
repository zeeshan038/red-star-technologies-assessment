
import { Workspace, WorkspaceCreationAttributes } from "../models/workspace.js";

export class WorkspaceRepository {
    async create(data: WorkspaceCreationAttributes) {
        return Workspace.create(data);
    }

    async findById(id: number) {
        return Workspace.findByPk(id);
    }

    async findByName(name: string) {
        return Workspace.findOne({ where: { name } });
    }

    async findByCreator(created_by: number) {
        return Workspace.findAll({ where: { created_by } });
    }

    async findByIdAndCreator(id: number, created_by: number) {
        return Workspace.findOne({ where: { id, created_by } });
    }

    async findAll() {
        return Workspace.findAll();
    }

    async update(id: number, data: Partial<WorkspaceCreationAttributes>) {
        const workspace = await this.findById(id);
        if (!workspace) {
            return null;
        }
        return workspace.update(data);
    }

    async delete(id: number) {
        return Workspace.destroy({ where: { id } });
    }
}

export const workspaceRepo = new WorkspaceRepository();
