import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// projects (id, workspace_id, name, description, created_at)

export interface ProjectAttributes {
    id: number;
    workspace_id: number;
    name: string;
    description: string;
    created_at: Date;
}

export type ProjectCreationAttributes = Optional<
    ProjectAttributes,
    "id" | "created_at"
>;

export class Project
    extends Model<ProjectAttributes, ProjectCreationAttributes>
    implements ProjectAttributes {
    declare id: number;
    declare workspace_id: number;
    declare name: string;
    declare description: string;
    declare created_at: Date;
}

Project.init(
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

        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING(255),
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
        tableName: "projects",
        timestamps: true,
    }
);