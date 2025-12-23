"use client";
import { MoreVertical, Plus } from "lucide-react";
import { useGetWorkspaceProjectsQuery } from "@/features/project/projectApi";
import { Loader2 } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecentProjectsProps {
    workspaceId: string | null;
}

export const RecentProjects = ({ workspaceId }: RecentProjectsProps) => {
    const { data: projects, isLoading } = useGetWorkspaceProjectsQuery(workspaceId, {
        skip: !workspaceId,
    });


    const router = useRouter();

    if (!workspaceId) {
        return (
            <div className="space-y-4 lg:space-y-6 opacity-50 pointer-events-none">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">Recent Projects</h3>
                </div>
                <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400">
                    Select a workspace to view projects
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">Recent Projects</h3>
                <button className="text-xs lg:text-sm font-bold text-brand-deep hover:underline flex items-center gap-1 group">
                    View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading ? (
                    [1, 2].map(i => (
                        <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />
                    ))
                ) : projects?.data?.length > 0 ? (
                    <>
                        {projects.data.map((project: any) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                description={project.description || "No description provided."}
                                initial={project.name.charAt(0).toUpperCase()}
                                color="from-brand-deep to-brand-pink"
                                tasks={project.taskCount || 0}
                                onClick={(id) => router.push(`/dashboard/project/${id}`)}
                            />
                        ))}
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-deep/30 hover:bg-white transition-all group cursor-pointer min-h-[160px]">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 text-gray-400 group-hover:bg-brand-deep/5 group-hover:text-brand-deep transition-all">
                                <Plus size={24} />
                            </div>
                            <p className="font-bold text-gray-900">New Project</p>
                            <p className="text-xs text-gray-400 mt-1">Start from scratch or template</p>
                        </div>
                    </>
                ) : (
                    <div className="col-span-full border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                        <p className="font-bold text-gray-900 mb-1">No projects found</p>
                        <p className="text-xs text-gray-400">Create a project to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

function ProjectCard({ id, name, description, initial, color, tasks, onClick }: { id: string, name: string, description: string, initial: string, color: string, tasks: number, onClick: (id: string) => void }) {
    return (
        <div
            onClick={() => onClick(id)}
            className="bg-white p-5 lg:p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-deep/5 transition-all duration-500 group cursor-pointer relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={18} className="text-gray-400" />
            </div>

            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center text-lg lg:text-xl font-bold shadow-lg shadow-brand-deep/10 mb-4 lg:mb-6 group-hover:rotate-3 transition-transform`}>
                {initial}
            </div>

            <h4 className="text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-deep transition-colors line-clamp-1">{name}</h4>
            <p className="text-[11px] lg:text-xs text-gray-400 font-medium leading-relaxed mb-6 lg:mb-8 line-clamp-2">{description}</p>

            <div className="flex items-center justify-between pt-4 lg:pt-5 border-t border-gray-50">
                <div className="flex -space-x-1.5 lg:-space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white bg-gray-${i * 100 + 100}`} />
                    ))}
                </div>
                <div className="px-2 lg:px-3 py-0.5 lg:py-1 bg-gray-50 rounded-full">
                    <span className="text-[9px] lg:text-[10px] uppercase font-bold text-gray-400 tracking-wider group-hover:text-brand-deep transition-colors">{tasks} Tasks</span>
                </div>
            </div>
        </div>
    );
}
