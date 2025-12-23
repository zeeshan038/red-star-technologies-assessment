import { Workspace } from "../models/workspace.js";
export class WorkspaceRepository {
    async create(data) {
        return Workspace.create(data);
    }
    async findById(id) {
        return Workspace.findByPk(id);
    }
    async findByName(name) {
        return Workspace.findOne({ where: { name } });
    }
    async findByCreator(created_by) {
        return Workspace.findAll({ where: { created_by } });
    }
    async findByIdAndCreator(id, created_by) {
        return Workspace.findOne({ where: { id, created_by } });
    }
    async findAll() {
        return Workspace.findAll();
    }
    async update(id, data) {
        const workspace = await this.findById(id);
        if (!workspace) {
            return null;
        }
        return workspace.update(data);
    }
    async delete(id) {
        return Workspace.destroy({ where: { id } });
    }
}
export const workspaceRepo = new WorkspaceRepository();
