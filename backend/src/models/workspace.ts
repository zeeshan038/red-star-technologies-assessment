import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// workspaces (id, name, created_by, created_at)

export interface WorkspaceAttributes {
    id: number;
    name: string;
    created_by: number;
    created_at: Date;
}

export type WorkspaceCreationAttributes = Optional<
    WorkspaceAttributes,
    "id" | "created_at"
>;

export class Workspace
    extends Model<WorkspaceAttributes, WorkspaceCreationAttributes>
    implements WorkspaceAttributes {
    declare id: number;
    declare name: string;
    declare created_by: number;
    declare created_at: Date;
}

Workspace.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "workspaces",
        timestamps: false,
        indexes: [{ unique: true, fields: ["name"] }],
    }
);
