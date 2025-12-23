import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export class Workspace extends Model {
}
Workspace.init({
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
}, {
    sequelize,
    tableName: "workspaces",
    timestamps: false,
    indexes: [{ unique: true, fields: ["name"] }],
});
