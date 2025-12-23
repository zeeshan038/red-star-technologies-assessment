
import { WorkspaceMember, WorkspaceMemberCreationAttributes } from "../models/workspaceMembers.js";
import { User } from "../models/user.js";

export class WorkspaceMemberRepository {
    async create(data: WorkspaceMemberCreationAttributes) {
        return WorkspaceMember.create(data);
    }

    async findById(id: number) {
        return WorkspaceMember.findByPk(id);
    }

    async findByWorkspaceId(workspace_id: number) {
        return WorkspaceMember.findAll({
            where: { workspace_id },
            include: [{ model: User, as: "user" }]
        });
    }

    async findByUserId(user_id: number) {
        return WorkspaceMember.findAll({ where: { user_id } });
    }

    async findOne(workspace_id: number, user_id: number) {
        return WorkspaceMember.findOne({ where: { workspace_id, user_id } });
    }

    async update(id: number, data: Partial<WorkspaceMemberCreationAttributes>) {
        const member = await this.findById(id);
        if (!member) {
            return null;
        }
        return member.update(data);
    }

    async delete(id: number) {
        return WorkspaceMember.destroy({ where: { id } });
    }
}

export const workspaceMemberRepo = new WorkspaceMemberRepository();
