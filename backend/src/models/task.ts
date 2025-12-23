import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskAttributes {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: Date | null;
    assigned_to: number | null;
    created_at: Date;
}

export type TaskCreationAttributes = Optional<TaskAttributes, "id" | "created_at">;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    declare id: number;
    declare project_id: number;
    declare title: string;
    declare description: string | null;
    declare status: TaskStatus;
    declare priority: TaskPriority;
    declare due_date: Date | null;
    declare assigned_to: number | null;
    declare created_at: Date;
}

Task.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        project_id: { type: DataTypes.INTEGER, allowNull: false },

        title: { type: DataTypes.STRING(200), allowNull: false },

        description: { type: DataTypes.TEXT, allowNull: true },

        status: {
            type: DataTypes.ENUM("TODO", "IN_PROGRESS", "DONE"),
            allowNull: false,
            defaultValue: "TODO",
        },

        priority: {
            type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
            allowNull: false,
            defaultValue: "MEDIUM",
        },

        due_date: { type: DataTypes.DATE, allowNull: true },

        assigned_to: { type: DataTypes.INTEGER, allowNull: true },

        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
        sequelize,
        tableName: "tasks",
        timestamps: false,
    }
);
