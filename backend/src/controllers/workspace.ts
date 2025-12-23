import { Request, Response } from "express";
import { workspaceSchema } from "../schema/Workspace.js";

// Repositories
import { workspaceRepo } from "../repositories/workspace.repository.js";
import { workspaceMemberRepo } from "../repositories/workspaceMember.repository.js";
import { userRepo } from "../repositories/user.repository.js";

/**
 * @Description Create a new workspace
 * @Route POST /api/workspace/create
 * @Access Private
 */
export const createWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = workspaceSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }

    try {
        const workspace = await workspaceRepo.create({
            name: payload.name,
            created_by: userId!
        });

        // Add creator as an admin member by default
        await workspaceMemberRepo.create({
            workspace_id: workspace.id,
            user_id: userId!,
            role: "admin"
        });

        return res.status(201).json({
            status: true,
            msg: "Workspace created successfully",
            data: workspace
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Get all workspaces created by the user
 * @Route GET /api/workspace/all
 * @Access Private
 */
export const getWorkspaces = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    try {
        const workspaces = await workspaceRepo.findByCreator(userId!);
        return res.status(200).json({
            status: true,
            msg: "Workspaces fetched successfully",
            data: workspaces
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Get specific workspace by ID
 * @Route GET /api/workspace/:id
 * @Access Private
 */
export const getWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    try {
        const workspace = await workspaceRepo.findByIdAndCreator(Number(id), userId!);

        if (!workspace) {
            return res.status(404).json({
                status: false,
                msg: "Workspace not found or unauthorized"
            });
        }

        return res.status(200).json({
            status: true,
            msg: "Workspace fetched successfully",
            data: workspace
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description update workspace
 * @Route PUT /api/workspace/:id
 * @Access Private
 */
export const updateWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const payload = req.body;

    const result = workspaceSchema(payload);
    if (result.error) {
        return res.status(400).json({
            status: false,
            msg: result.error.details[0].message
        });
    }

    try {
        const workspace = await workspaceRepo.findByIdAndCreator(Number(id), userId!);

        if (!workspace) {
            return res.status(404).json({
                status: false,
                msg: "Workspace not found or unauthorized"
            });
        }

        await workspaceRepo.update(workspace.id, { name: payload.name });

        return res.status(200).json({
            status: true,
            msg: "Workspace updated successfully",
            data: workspace
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description delete workspace
 * @Route DELETE /api/workspace/:id
 * @Access Private
 */
export const deleteWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    try {
        const workspace = await workspaceRepo.findByIdAndCreator(Number(id), userId!);

        if (!workspace) {
            return res.status(404).json({
                status: false,
                msg: "Workspace not found or unauthorized"
            });
        }

        await workspaceRepo.delete(workspace.id);

        return res.status(200).json({
            status: true,
            msg: "Workspace deleted successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description Add member to workspace
 * @Route POST /api/workspace/add-member/:workspaceId/:memberId
 * @Access Private
 */
export const addMemberToWorkspace = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { workspaceId, memberId } = req.params;

    try {
        const workspace = await workspaceRepo.findByIdAndCreator(Number(workspaceId), userId!);

        if (!workspace) {
            return res.status(404).json({
                status: false,
                msg: "Workspace not found or unauthorized"
            });
        }
        const userToAdd = await userRepo.findById(Number(memberId));
        if (!userToAdd) {
            return res.status(404).json({
                status: false,
                msg: "User to add not found"
            });
        }

        const existingMember = await workspaceMemberRepo.findOne(Number(workspaceId), Number(memberId));

        if (existingMember) {
            return res.status(400).json({
                status: false,
                msg: "User is already a member of this workspace"
            });
        }

        const workspaceMember = await workspaceMemberRepo.create({
            workspace_id: Number(workspaceId),
            user_id: Number(memberId),
            role: "member"
        });

        return res.status(200).json({
            status: true,
            msg: "Member added to workspace successfully",
            data: workspaceMember
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

/**
 * @Description get workspace members
 * @Route GET /api/workspace/members/:workspaceId
 * @Access Private
 */
export const getWorkspaceMembers = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    try {
        const workspace = await workspaceRepo.findById(Number(workspaceId));

        if (!workspace) {
            return res.status(404).json({
                status: false,
                msg: "Workspace not found or unauthorized"
            });
        }

        const members = await workspaceMemberRepo.findByWorkspaceId(Number(workspaceId));

        return res.status(200).json({
            status: true,
            msg: "Workspace members fetched successfully",
            data: members
        });
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};