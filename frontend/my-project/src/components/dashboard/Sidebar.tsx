"use client";

import React from "react";
import {
    LayoutDashboard,
    CheckCircle2,
    Bell,
    Hash,
    PlusCircle,
    LogOut,
    Plus,
    X
} from "lucide-react";

import { useGetWorkspaceProjectsQuery } from "@/features/project/projectApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
    onClose: () => void;
    activeProjectId?: string | null;
}

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, workspaceId, activeProjectId }: SidebarProps) => {
    const router = useRouter();
    const [user, setUser] = React.useState<{ username: string; email: string } | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Sidebar content */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#2e061f] text-white flex flex-col transition-transform duration-300 transform 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:relative lg:translate-x-0 lg:w-60 shrink-0
            `}>
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={150}
                            height={150}
                        />

                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Sidebar */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                    <SidebarItem
                        icon={<LayoutDashboard size={18} />}
                        label="Home"
                        active={activeTab === "home"}
                        onClick={() => {
                            setActiveTab("home");
                            onClose();
                        }}
                    />
                    <div className="mt-8 mb-2 cursor-pointer px-3 text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center justify-between group">
                        Projects
                        <button className="opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                            <Plus size={14} />
                        </button>
                    </div>

                    <ProjectsList workspaceId={workspaceId} activeProjectId={activeProjectId} />

                    <button className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white transition-colors w-full group mt-4">
                        <PlusCircle size={18} className="group-hover:text-brand-pink transition-colors" />
                        <span>Create Project</span>
                    </button>
                </nav>
            </aside>
        </>
    );
};

function SidebarItem({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: React.ReactNode,
    label: string,
    active?: boolean,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${active
                ? "bg-white/10 text-white shadow-lg ring-1 ring-white/10"
                : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span className={`${active ? "text-brand-pink" : "group-hover:text-brand-pink transition-colors"}`}>
                {icon}
            </span>
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(255,51,102,0.8)]" />}
        </button>
    );
}

function ProjectsList({ workspaceId, activeProjectId }: { workspaceId: string | null; activeProjectId?: string | null }) {
    const router = useRouter();
    const { data: projects, isLoading } = useGetWorkspaceProjectsQuery(workspaceId, {
        skip: !workspaceId,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 size={16} className="animate-spin text-white/40" />
            </div>
        );
    }

    if (!workspaceId) {
        return (
            <div className="px-3 py-2 text-xs text-white/40 italic">
                Select a workspace
            </div>
        );
    }

    if (!projects?.data || projects.data.length === 0) {
        return (
            <div className="px-3 py-2 text-xs text-white/40 italic">
                No projects found
            </div>
        );
    }

    return (
        <div className="space-y-0.5">
            {projects.data.map((project: any) => (
                <SidebarItem
                    key={project.id}
                    icon={<Hash size={18} className="text-white/60 cursor-pointer group-hover:text-brand-pink transition-colors" />}
                    label={project.name}
                    active={activeProjectId === project.id}
                    onClick={() => router.push(`/dashboard/project/${project.id}`)}
                />
            ))}
        </div>
    );
}
