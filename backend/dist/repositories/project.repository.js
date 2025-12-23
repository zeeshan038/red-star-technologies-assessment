import { Project } from "../models/projects.js";
export class ProjectRepository {
    async create(data) {
        return Project.create(data);
    }
    async findById(id) {
        return Project.findByPk(id);
    }
    async findByWorkspaceId(workspace_id) {
        return Project.findAll({ where: { workspace_id } });
    }
    async findAll() {
        return Project.findAll();
    }
    async update(id, data) {
        const project = await this.findById(id);
        if (!project) {
            return null;
        }
        return project.update(data);
    }
    async delete(id) {
        return Project.destroy({ where: { id } });
    }
}
export const projectRepo = new ProjectRepository();
