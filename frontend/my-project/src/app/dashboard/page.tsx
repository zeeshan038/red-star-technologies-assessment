"use client";
import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    Plus,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import { WorkspaceDetailsModal } from "@/components/dashboard/WorkspaceDetailsModal";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { WorkspaceMembers } from "@/components/dashboard/WorkspaceMembers";
import { useDashboard } from "./dashboard-context";

export default function DashboardPage() {
    const {
        activeWorkspaceId,
        setActiveWorkspaceId,
        user,
        workspaces,
        setIsCreateWorkspaceModalOpen,
        isLoading: isWorkspacesLoading
    } = useDashboard();

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    useEffect(() => {
        if (!isWorkspacesLoading && (!workspaces || workspaces.length === 0)) {
            setIsCreateWorkspaceModalOpen(true);
        }
    }, [isWorkspacesLoading, workspaces, setIsCreateWorkspaceModalOpen]);

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">

            {/* Welcome Banner */}
            <div className="mb-8 lg:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="text-[10px] lg:text-sm font-bold text-brand-deep/60 mb-2 uppercase tracking-[0.2em]">Wednesday, December 24</p>
                <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Good afternoon, {user?.name?.split(' ')[0] || 'User'}</h1>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Left Content Area */}
                <div className="lg:col-span-2 space-y-8 lg:space-y-12">

                    <RecentProjects workspaceId={activeWorkspaceId} />

                    <WorkspaceMembers workspaceId={activeWorkspaceId} />

                    {/* Workspaces Grid Section (Quick Access) */}
                    <div className="space-y-4 lg:space-y-6 pt-6 border-t border-dashed border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Your Workspaces</h3>
                            <button
                                onClick={() => setIsCreateWorkspaceModalOpen(true)}
                                className="text-xs lg:text-sm font-bold text-brand-deep hover:underline flex items-center gap-1 group"
                            >
                                Add new <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isWorkspacesLoading ? (
                                [1, 2].map(i => (
                                    <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />
                                ))
                            ) : workspaces?.map((ws: any) => (
                                <WorkspaceCard
                                    key={ws.id}
                                    id={ws.id}
                                    name={ws.name}
                                    owner={ws.createdBy?.name || "Member"}
                                    initial={ws.name.charAt(0).toUpperCase()}
                                    members={ws.members}
                                    onClick={(id) => setSelectedWorkspaceId(id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="space-y-6">
                    {/* Insight Box */}
                    <div className="asana-gradient rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-pink/20">
                        <div className="relative z-10">
                            <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <CheckCircle2 size={24} />
                            </div>
                            <h4 className="font-bold text-lg lg:text-xl mb-3">Efficiency Tip</h4>
                            <p className="text-xs lg:text-sm text-white/80 leading-relaxed mb-6">
                                Projects with clear deadlines are finished <span className="text-white font-bold">2x faster</span>. Try setting a due date for all your tasks today!
                            </p>
                            <button className="text-white text-[10px] lg:text-xs font-bold flex items-center gap-2 hover:gap-3 transition-all group">
                                Learn more about focus
                                <ChevronRight size={14} className="opacity-60 group-hover:opacity-100" />
                            </button>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -left-6 -top-6 w-24 h-24 bg-brand-pink/20 rounded-full blur-2xl" />
                    </div>
                </div>

            </div>

            <WorkspaceDetailsModal
                workspaceId={selectedWorkspaceId}
                onClose={() => setSelectedWorkspaceId(null)}
            />
        </div>
    );
}

function WorkspaceCard({ id, name, owner, initial, members, onClick }: { id: string, name: string, owner: string, initial: string, members: any[], onClick: (id: string) => void }) {

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div
            onClick={() => onClick(id)}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-deep/5 transition-all duration-300 group cursor-pointer relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-deep/5 flex items-center justify-center text-brand-deep font-bold text-xl group-hover:bg-brand-deep group-hover:text-white transition-all duration-300">
                    {initial}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{name}</h4>
                    <p className="text-xs text-brand-deep/60 font-medium">Owned by {owner}</p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {members && members.length > 0 ? (
                            members.slice(0, 3).map((member: any) => (
                                <div key={member.id} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-50 text-[8px] font-bold flex items-center justify-center text-indigo-600">
                                    {getInitials(member.user?.name || member.name || "U")}
                                </div>
                            ))
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                        )}
                        {members && members.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-50 text-[8px] font-bold flex items-center justify-center text-gray-400">
                                +{members.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{members?.length || 0} {members?.length === 1 ? 'Member' : 'Members'}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-deep/5 group-hover:text-brand-deep transition-all">
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
}
