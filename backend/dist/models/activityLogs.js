import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class ActivityLog extends Model {
}
ActivityLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: "activity_logs",
    timestamps: true
});
import { Task } from "./task.js";
import { User } from "./user.js";
ActivityLog.belongsTo(Task, { foreignKey: "task_id", as: "task" });
ActivityLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
