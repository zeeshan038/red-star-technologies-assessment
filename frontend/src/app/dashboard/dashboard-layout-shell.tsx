"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CreateWorkspaceModal } from "@/components/dashboard/CreateWorkspaceModal";
import { useDashboard } from "./dashboard-context";
import { usePathname, useRouter, useParams } from "next/navigation";

export function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
    const {
        activeWorkspaceId,
        setActiveWorkspaceId,
        selectedWorkspaceName,
        workspaces,
        isSidebarOpen,
        setIsSidebarOpen,
        user,
        openCreateWorkspaceModal,
        isCreateWorkspaceModalOpen,
        setIsCreateWorkspaceModalOpen,
        isLoading
    } = useDashboard();

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const activeProjectId = params?.projectId as string;
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        if (pathname === "/dashboard") {
            setActiveTab("home");
        } else {
            setActiveTab("");
        }
    }, [pathname]);

    const handleWorkspaceSelect = (id: string, name: string) => {
        setActiveWorkspaceId(id);
        router.push("/dashboard");
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === "home") {
            router.push("/dashboard");
        }
    };

    if (isLoading && (!workspaces || workspaces.length === 0)) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="relative h-32 w-32 animate-pulse">
                    <img
                        src="/logo.svg"
                        alt="Loading..."
                        className="object-contain h-full w-full"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden text-gray-800 font-sans">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                workspaceId={activeWorkspaceId}
                activeProjectId={activeProjectId}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader
                    selectedWorkspace={selectedWorkspaceName}
                    selectedWorkspaceId={activeWorkspaceId}
                    workspaces={workspaces}
                    onWorkspaceSelect={handleWorkspaceSelect}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onCreateWorkspaceClick={openCreateWorkspaceModal}
                    user={user}
                />

                <div className="flex-1 overflow-y-auto bg-[#fafafa] custom-scrollbar">
                    {children}
                </div>
            </main>

            <CreateWorkspaceModal
                isOpen={isCreateWorkspaceModalOpen}
                onClose={() => setIsCreateWorkspaceModalOpen(false)}
            />
        </div>
    );
}

