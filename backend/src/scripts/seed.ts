import { sequelize } from "../config/db.js";
import { User } from "../models/user.js";
import { Workspace } from "../models/workspace.js";
import { Project } from "../models/projects.js";
import bcrypt from "bcryptjs";

const seed = async () => {
    try {
        console.log("Starting database seeding...");

        // Create a default user
        const hashedPassword = await bcrypt.hash("password123", 10);
        const [user] = await User.findOrCreate({
            where: { email: "admin@tasktorch.com" },
            defaults: {
                name: "Admin User",
                email: "admin@tasktorch.com",
                password: hashedPassword
            }
        });

        // Create a workspace
        const [workspace] = await Workspace.findOrCreate({
            where: { name: "Default Workspace" },
            defaults: {
                name: "Default Workspace",
                created_by: user.id
            }
        });

        // Create a project
        await Project.findOrCreate({
            where: { name: "Sample Project" },
            defaults: {
                name: "Sample Project",
                description: "This is a sample project created during seeding.",
                workspace_id: workspace.id
            }
        });

        console.log("Database seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seed();
