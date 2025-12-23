
"use client";

import React, { useState } from "react";
import { X, Users, Briefcase, Plus, MoreVertical, ArrowRight, ArrowLeft, Search, Loader2 } from "lucide-react";
import { useGetSpecificWorkspaceQuery, useGetAllMembersQuery, useAddMemberToWorkspaceMutation } from "@/features/workspace/workspaceApi";
import { useGetWorkspaceProjectsQuery, useCreateProjectMutation } from "@/features/project/projectApi";
import { useLazySearchUsersQuery } from "@/features/auth/authApi";

interface WorkspaceDetailsModalProps {
    workspaceId: string | null;
    onClose: () => void;
}

type ViewMode = 'details' | 'add_project' | 'add_member';

export const WorkspaceDetailsModal: React.FC<WorkspaceDetailsModalProps> = ({ workspaceId, onClose }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('details');

    // API Hooks
    const { data: workspace, isLoading: isWorkspaceLoading } = useGetSpecificWorkspaceQuery(workspaceId, { skip: !workspaceId });
    const { data: projects, isLoading: isProjectsLoading } = useGetWorkspaceProjectsQuery(workspaceId, { skip: !workspaceId });
    const { data: members, isLoading: isMembersLoading } = useGetAllMembersQuery(workspaceId, { skip: !workspaceId });

    const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation();
    const [addMember, { isLoading: isAddingMember }] = useAddMemberToWorkspaceMutation();
    const [triggerSearchUsers, { data: searchResults, isFetching: isSearchingUsers }] = useLazySearchUsersQuery();

    // Form States
    const [projectName, setProjectName] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [error, setError] = useState("");

    if (!workspaceId) return null;

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await createProject({
                workspaceId,
                body: {
                    name: projectName,
                    description: projectDesc
                }
            }).unwrap();

            if (res.status) {
                setProjectName("");
                setProjectDesc("");
                setViewMode('details');
            }
        } catch (err: any) {
            setError(err.data?.msg || "Failed to create project");
        }
    };

    const handleSearchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setUserSearchQuery(query);
        if (query.length > 2) {
            triggerSearchUsers(query);
        }
    };

    const handleAddMember = async (userId: string) => {
        try {
            const res = await addMember({
                workspaceId,
                memberId: userId,
                body: {}
            }).unwrap();

            if (res.status) {
                setViewMode('details');
                setUserSearchQuery("");
            }
        } catch (err: any) {
            setError(err.data?.msg || "Failed to add member");
        }
    };

    // Reset view when closing
    const handleClose = () => {
        setViewMode('details');
        setProjectName("");
        setProjectDesc("");
        setUserSearchQuery("");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
            <div className="absolute inset-0 bg-brand-deep/40 backdrop-blur-md animate-in fade-in duration-300" onClick={handleClose} />

            <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 max-h-[90vh] flex flex-col">

                {/* Dynamic Header */}
                <div className="asana-gradient p-8 text-white relative shrink-0">
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/80 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    {viewMode !== 'details' && (
                        <button
                            onClick={() => {
                                setViewMode('details');
                                setError("");
                            }}
                            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/80 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}

                    <div className="flex items-center gap-4 mb-4 mt-2">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black border border-white/20 shadow-xl">
                            {isWorkspaceLoading ? "..." : workspace?.data?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-none mb-1">
                                {isWorkspaceLoading ? "Loading..." : workspace?.data?.name}
                            </h2>
                            <span className="px-3 py-0.5 bg-white/15 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                                {viewMode === 'add_project' ? 'Create Project' : viewMode === 'add_member' ? 'Add Member' : 'Overview'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/30">

                    {viewMode === 'details' && (
                        <div className="grid lg:grid-cols-3 gap-10">
                            {/* Projects Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                                        <Briefcase size={22} className="text-brand-deep" /> Projects
                                    </h3>
                                    <button
                                        onClick={() => setViewMode('add_project')}
                                        className="text-brand-deep font-bold text-sm flex items-center gap-1 hover:bg-brand-deep/5 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus size={16} /> New Project
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {isProjectsLoading ? (
                                        [1, 2].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />)
                                    ) : projects?.data?.length > 0 ? (
                                        projects.data.map((project: any) => (
                                            <div key={project.id} className="p-6 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-brand-deep/5 transition-all group flex flex-col justify-between">
                                                <div>
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base font-bold mb-3">
                                                        {project.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-brand-deep transition-colors truncate">{project.name}</h4>
                                                    <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{project.description || "No description provided."}</p>
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                                                    <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                            <Briefcase className="text-gray-300 mb-3" size={32} />
                                            <p className="text-gray-900 font-bold mb-1">No projects found</p>
                                            <button onClick={() => setViewMode('add_project')} className="text-brand-deep text-sm font-bold hover:underline">Create your first project</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Members Column */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                                        <Users size={22} className="text-brand-deep" /> Members
                                    </h3>
                                    <button
                                        onClick={() => setViewMode('add_member')}
                                        className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar">
                                    <div className="space-y-1 p-2">
                                        {isMembersLoading ? (
                                            [1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded-2xl" />)
                                        ) : members?.data?.length > 0 ? (
                                            members.data.map((member: any) => (
                                                <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition-colors group">
                                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-sm">
                                                        {getInitials(member.user?.name || member.name || "U")}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 leading-none mb-1 truncate">{member.user?.name || member.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role || "Member"}</p>
                                                            <p className="text-[10px] text-gray-300 truncate">{member.user?.email || member.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-400 py-8 text-xs font-medium">No members yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'add_project' && (
                        <div className="max-w-xl mx-auto py-8">
                            <form onSubmit={handleCreateProject} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Project Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Q4 Marketing Campaign"
                                        required
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-deep/20 focus:border-brand-deep outline-none font-medium"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <textarea
                                        placeholder="Briefly describe the project goals..."
                                        rows={4}
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-deep/20 focus:border-brand-deep outline-none font-medium resize-none"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isCreatingProject}
                                    className="w-full py-4 bg-brand-deep text-white font-bold rounded-2xl shadow-xl shadow-brand-deep/20 hover:scale-[1.02] transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isCreatingProject ? <Loader2 className="animate-spin" /> : "Create Project"}
                                </button>
                            </form>
                        </div>
                    )}

                    {viewMode === 'add_member' && (
                        <div className="max-w-xl mx-auto py-8">
                            <div className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={userSearchQuery}
                                        onChange={handleSearchUsers}
                                        className="w-full pl-14 pr-4 py-5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-deep/20 focus:border-brand-deep outline-none font-medium text-lg"
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
                                    {isSearchingUsers ? (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                            <Loader2 className="animate-spin mb-2" size={32} />
                                            <p className="text-sm font-medium">Searching users...</p>
                                        </div>
                                    ) : searchResults?.data?.length > 0 ? (
                                        <div className="divide-y divide-gray-50">
                                            {searchResults.data.map((user: any) => {
                                                const isAlreadyMember = members?.data?.some((m: any) => m.user?.id === user.id || m.user_id === user.id);
                                                return (
                                                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-brand-deep/10 text-brand-deep flex items-center justify-center font-bold">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{user.name}</p>
                                                                <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => !isAlreadyMember && handleAddMember(user.id)}
                                                            disabled={isAlreadyMember || isAddingMember}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isAlreadyMember
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-brand-deep text-white hover:bg-brand-deep/90 shadow-lg shadow-brand-deep/20"
                                                                }`}
                                                        >
                                                            {isAlreadyMember ? "Member" : "Add"}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : userSearchQuery.length > 2 ? (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                            <Users size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold">No users found</p>
                                            <p className="text-xs">Try a different name or email</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                                            <Search size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold">Search for people</p>
                                            <p className="text-xs">Invite them to collaborate</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-end shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-10 py-3 bg-brand-deep text-white font-black rounded-2xl text-sm hover:shadow-xl hover:shadow-brand-deep/20 transition-all active:scale-95"
                    >
                        Close View
                    </button>
                </div>
            </div>
        </div>
    );
};
