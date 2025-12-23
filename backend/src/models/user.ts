import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
}

export type UserCreationAttributes = Optional<
    UserAttributes,
    "id" | "created_at"
>;

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare created_at: Date;
}

User.init(
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

        email: {
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },

        password: {
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
        tableName: "users",
        timestamps: false,
        indexes: [{ unique: true, fields: ["email"] }],
    }
);
