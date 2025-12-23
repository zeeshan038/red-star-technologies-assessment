import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class Task extends Model {
}
Task.init({
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
}, {
    sequelize,
    tableName: "tasks",
    timestamps: false,
});
