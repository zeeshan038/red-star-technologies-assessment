import { sequelize } from "../config/db.js";
import "../models/user";
import "../models/workspace";
import "../models/projects";
import "../models/task";
import "../models/workspaceMembers";
import "../models/activityLogs";

const migrate = async () => {
    try {
        console.log("Starting database migration...");
        await sequelize.sync({ alter: true });
        console.log("Database migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
