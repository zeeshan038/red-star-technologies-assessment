"use client";
import { Plus, Users } from "lucide-react";
import { useGetAllMembersQuery } from "@/features/workspace/workspaceApi";

interface WorkspaceMembersProps {
    workspaceId: string | null;
}

export const WorkspaceMembers = ({ workspaceId }: WorkspaceMembersProps) => {
    const { data: members, isLoading } = useGetAllMembersQuery(workspaceId, {
        skip: !workspaceId,
    });

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    if (!workspaceId) {
        return null;
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Workspace Members</h3>
                <button className="text-xs lg:text-sm font-bold text-brand-deep hover:underline flex items-center gap-1 group">
                    Manage <Users size={14} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="flex gap-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 bg-gray-100 rounded-full" />)}
                    </div>
                ) : members?.data?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {members.data.map((member: any) => (
                            <div key={member.id} className="group relative">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:scale-110 transition-transform">
                                    {getInitials(member.user?.name || member.name || "U")}
                                </div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {member.user?.name || member.name}
                                </div>
                            </div>
                        ))}
                        <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-brand-deep hover:text-brand-deep transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        No members yet. <button className="text-brand-deep font-bold hover:underline">Invite someone</button>
                    </div>
                )}
            </div>
        </div>
    );
};
