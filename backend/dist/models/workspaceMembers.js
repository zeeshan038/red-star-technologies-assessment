import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class WorkspaceMember extends Model {
}
WorkspaceMember.init({
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
}, {
    sequelize,
    tableName: "workspace_members",
    timestamps: true,
    indexes: [{ unique: true, fields: ["workspace_id", "user_id"] }],
});
import { User } from "./user.js";
WorkspaceMember.belongsTo(User, { foreignKey: "user_id", as: "user" });
