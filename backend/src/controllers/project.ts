import { Request, Response } from "express";
import { projectSchema } from "../schema/Project";
import { Project } from "../models/projects";


/**
 * @Description Create a new project
 * @Route POST /api/project/create
 * @Access Private
 */
export const createProject = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const payload = req.body;

    const result = projectSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }

    try {
        const project = await Project.create({
            ...payload,
            workspace_id: workspaceId,
        });

        return res.status(201).json({
            status: true,
            msg: "Project created successfully",
            data: project
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Get all workspace projects
 * @Route GET /api/project/all/:workspaceId
 * @Access Private
 */
export const getWorkspaceProjects = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    try {
        const projects = await Project.findAll({
            where: {
                workspace_id: workspaceId
            }
        });
        return res.status(200).json({
            status: true,
            msg: "Projects fetched successfully",
            data: projects
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Get specific project
 * @Route GET /api/project/:projectId
 * @Access Private
 */
export const getProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findOne({
            where: {
                id: projectId
            }
        });
        return res.status(200).json({
            status: true,
            msg: "Project fetched successfully",
            data: project
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Delete project
 * @Route DELETE /api/project/delete/:projectId
 * @Access Private
 */
export const deleteProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    try {
        const project = await Project.destroy({
            where: {
                id: projectId
            }
        });
        return res.status(200).json({
            status: true,
            msg: "Project deleted successfully",
            data: project
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};


