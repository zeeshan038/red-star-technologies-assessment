
import { Project, ProjectCreationAttributes } from "../models/projects.js";

export class ProjectRepository {
    async create(data: ProjectCreationAttributes) {
        return Project.create(data);
    }

    async findById(id: number) {
        return Project.findByPk(id);
    }

    async findByWorkspaceId(workspace_id: number) {
        return Project.findAll({ where: { workspace_id } });
    }

    async findAll() {
        return Project.findAll();
    }

    async update(id: number, data: Partial<ProjectCreationAttributes>) {
        const project = await this.findById(id);
        if (!project) {
            return null;
        }
        return project.update(data);
    }

    async delete(id: number) {
        return Project.destroy({ where: { id } });
    }
}

export const projectRepo = new ProjectRepository();
