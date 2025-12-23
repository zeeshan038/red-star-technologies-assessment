import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";


export interface WorkspaceMemberAttributes {
    id: number;
    workspace_id: number;
    user_id: number;
    role: string;
}

export type WorkspaceMemberCreationAttributes = Optional<
    WorkspaceMemberAttributes,
    "id"
>;

export class WorkspaceMember
    extends Model<WorkspaceMemberAttributes, WorkspaceMemberCreationAttributes>
    implements WorkspaceMemberAttributes {
    declare id: number;
    declare workspace_id: number;
    declare user_id: number;
    declare role: string;
}

WorkspaceMember.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        workspace_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        role: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "member"
        },
    },
    {
        sequelize,
        tableName: "workspace_members",
        timestamps: true,
        indexes: [{ unique: true, fields: ["workspace_id", "user_id"] }],
    }
);
import { User } from "./user.js";

WorkspaceMember.belongsTo(User, { foreignKey: "user_id", as: "user" });
