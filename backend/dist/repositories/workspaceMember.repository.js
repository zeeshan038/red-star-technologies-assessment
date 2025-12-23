import { WorkspaceMember } from "../models/workspaceMembers.js";
import { User } from "../models/user.js";
export class WorkspaceMemberRepository {
    async create(data) {
        return WorkspaceMember.create(data);
    }
    async findById(id) {
        return WorkspaceMember.findByPk(id);
    }
    async findByWorkspaceId(workspace_id) {
        return WorkspaceMember.findAll({
            where: { workspace_id },
            include: [{ model: User, as: "user" }]
        });
    }
    async findByUserId(user_id) {
        return WorkspaceMember.findAll({ where: { user_id } });
    }
    async findOne(workspace_id, user_id) {
        return WorkspaceMember.findOne({ where: { workspace_id, user_id } });
    }
    async update(id, data) {
        const member = await this.findById(id);
        if (!member) {
            return null;
        }
        return member.update(data);
    }
    async delete(id) {
        return WorkspaceMember.destroy({ where: { id } });
    }
}
export const workspaceMemberRepo = new WorkspaceMemberRepository();
