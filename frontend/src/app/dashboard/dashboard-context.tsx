"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useGetAllWorkspaceQuery } from "@/features/workspace/workspaceApi";

interface DashboardContextType {
    activeWorkspaceId: string | null;
    setActiveWorkspaceId: (id: string | null) => void;
    selectedWorkspaceName: string;
    workspaces: any[];
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    user: { name: string; email: string } | null;
    openCreateWorkspaceModal: () => void;
    isLoading: boolean;
    isCreateWorkspaceModalOpen: boolean;
    setIsCreateWorkspaceModalOpen: (isOpen: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [selectedWorkspaceName, setSelectedWorkspaceName] = useState("My Workspace");

    const { data: workspaces, isLoading } = useGetAllWorkspaceQuery({});

    // Load User
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser.user || parsedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage");
            }
        }
    }, []);

    // Set Default Workspace
    useEffect(() => {
        if (!activeWorkspaceId && workspaces?.data?.length > 0) {
            setActiveWorkspaceId(workspaces.data[0].id);
        }
    }, [workspaces, activeWorkspaceId]);

    // Update Workspace Name
    useEffect(() => {
        if (activeWorkspaceId && workspaces?.data) {
            const ws = workspaces.data.find((w: any) => w.id === activeWorkspaceId);
            if (ws) {
                setSelectedWorkspaceName(ws.name);
            }
        }
    }, [activeWorkspaceId, workspaces]);

    const value = {
        activeWorkspaceId,
        setActiveWorkspaceId,
        selectedWorkspaceName,
        workspaces: workspaces?.data || [],
        isSidebarOpen,
        setIsSidebarOpen,
        user,
        openCreateWorkspaceModal: () => setIsCreateWorkspaceModalOpen(true),
        isLoading,
        isCreateWorkspaceModalOpen,
        setIsCreateWorkspaceModalOpen
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
