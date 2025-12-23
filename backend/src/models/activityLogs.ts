import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface ActivityLogAttributes {
    id: number;
    task_id: number;
    user_id: number;
    action: string;
    created_at: Date;
}

export type ActivityLogCreationAttributes = Optional<
    ActivityLogAttributes,
    "id" | "created_at"
>;

export class ActivityLog
    extends Model<ActivityLogAttributes, ActivityLogCreationAttributes>
    implements ActivityLogAttributes {
    declare id: number;
    declare task_id: number;
    declare user_id: number;
    declare action: string;
    declare created_at: Date;
}

ActivityLog.init(
    {
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
    },
    {
        sequelize,
        tableName: "activity_logs",
        timestamps: true
    }
);
