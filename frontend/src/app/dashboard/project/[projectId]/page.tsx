"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSpecificProjectQuery } from "@/features/project/projectApi";
import { useGetAllTaskQuery, useToggleTaskStatusMutation } from "@/features/task/taskApi";
import { useDashboard } from "../../dashboard-context";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    Loader2,
    LayoutGrid,
    Plus,
    MessageSquare,
    Home,
    ChevronRight,
    BarChart3,
} from "lucide-react";

type ViewMode = "board" | "list" | "overview";

import CreateTaskModal from "@/components/dashboard/CreateTaskModal";
import TaskDetailsSidebar from "@/components/dashboard/TaskDetailsSidebar";
import { ProjectOverview } from "./ProjectOverview";

const ItemTypes = {
    TASK: 'task'
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params?.projectId as string;
    const { setActiveWorkspaceId } = useDashboard();

    const { data: projectData, isLoading, isError } = useGetSpecificProjectQuery(projectId, {
        skip: !projectId
    });
    const [viewMode, setViewMode] = useState<ViewMode>("overview");
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const { data } = useGetAllTaskQuery({ projectId }, { skip: !projectId });
    useEffect(() => {
        if (projectData?.data?.workspaceId) {
            setActiveWorkspaceId(projectData.data.workspaceId);
        }
    }, [projectData, setActiveWorkspaceId]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa]">
                <Loader2 size={40} className="animate-spin text-[#5453E8]" />
            </div>
        );
    }

    if (isError || !projectData?.data) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fafafa] flex-col gap-4">
                <p className="text-gray-500">Project not found or error loading project.</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-[#5453E8] font-bold hover:underline"
                >
                    Go back to Dashboard
                </button>
            </div>
        );
    }

    const project = projectData.data;

    const allTasks = data?.data || [];

    const mockTasks = {
        todo: allTasks.filter((t: any) => t.status === "TODO"),
        inProgress: allTasks.filter((t: any) => t.status === "IN_PROGRESS"),
        completed: allTasks.filter((t: any) => t.status === "DONE")
    };
    const getPriorityStyles = (priority: string) => {
        // Handle API priority values (usually UPPERCASE)
        const p = priority?.toUpperCase() || "";
        switch (p) {
            case "HIGH": return "bg-[#fee2e2] text-[#b91c1c]";
            case "MEDIUM": return "bg-[#e0f2fe] text-[#0369a1]";
            case "LOW": return "bg-[#fef3c7] text-[#b45309]";
            case "IMPORTANT": return "bg-[#e0e7ff] text-[#4338ca]";
            case "MEH": return "bg-[#e0f2fe] text-[#0369a1]";
            case "OK": return "bg-[#fef3c7] text-[#b45309]";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-6 lg:p-10 font-sans max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                            <button onClick={() => router.push("/dashboard")} className="hover:text-[#5453E8] transition-colors">
                                <Home size={16} />
                            </button>
                            <ChevronRight size={16} strokeWidth={1.5} />
                            <span>Projects</span>
                            <ChevronRight size={16} strokeWidth={1.5} />
                            <span className="text-gray-900">{project.name}</span>
                        </div>


                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
                            <span className="px-3 py-1 bg-[#e0e7ff] text-[#5453E8] text-xs font-bold rounded-full">
                                Label
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs & Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 mb-8">
                    <div className="flex items-center gap-6 lg:gap-8 w-full sm:w-auto overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setViewMode("overview")}
                            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${viewMode === "overview"
                                ? "border-[#5453E8] text-[#5453E8]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            <BarChart3 size={18} /> Overview
                        </button>
                        <button
                            onClick={() => setViewMode("board")}
                            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${viewMode === "board"
                                ? "border-[#5453E8] text-[#5453E8]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            <LayoutGrid size={18} /> Grid View
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === "overview" ? (
                    <ProjectOverview projectId={projectId} />
                ) : viewMode === "board" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <TaskColumn
                            title="To Do"
                            status="TODO"
                            count={mockTasks.todo.length}
                            color="purple"
                            tasks={mockTasks.todo}
                            getPriorityStyles={getPriorityStyles}
                            onAddTask={() => { setCreateTaskDefaultStatus("TODO"); setIsCreateTaskModalOpen(true); }}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                        <TaskColumn
                            title="In Progress"
                            status="IN_PROGRESS"
                            count={mockTasks.inProgress.length}
                            color="orange"
                            tasks={mockTasks.inProgress}
                            getPriorityStyles={getPriorityStyles}
                            onAddTask={() => { setCreateTaskDefaultStatus("IN_PROGRESS"); setIsCreateTaskModalOpen(true); }}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                        <TaskColumn
                            title="Completed"
                            status="DONE"
                            count={mockTasks.completed.length}
                            color="green"
                            tasks={mockTasks.completed}
                            getPriorityStyles={getPriorityStyles}
                            onAddTask={() => { setCreateTaskDefaultStatus("DONE"); setIsCreateTaskModalOpen(true); }}
                            onTaskClick={(task) => setSelectedTask(task)}
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center text-gray-500">
                        <p>View is under construction. Please switch to Board or Overview.</p>
                    </div>
                )}


                <CreateTaskModal
                    isOpen={isCreateTaskModalOpen}
                    onClose={() => setIsCreateTaskModalOpen(false)}
                    projectId={projectId}
                    defaultStatus={createTaskDefaultStatus}
                />

                <TaskDetailsSidebar
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                />
            </div>
        </DndProvider>
    );
}

// Separate Draggable Component for Task Card
function DraggableTaskCard({ task, getPriorityStyles, onTaskClick }: { task: any, getPriorityStyles: any, onTaskClick: any }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
            onClick={() => onTaskClick(task)}
            className={`bg-white p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] transition-all cursor-pointer group ${isDragging ? "opacity-50" : "opacity-100"}`}
        >
            {/* Priority Tag */}
            <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide ${getPriorityStyles(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            {/* Title */}
            <h4 className="text-[15px] leading-snug font-bold text-gray-900 mb-6 group-hover:text-[#5453E8] transition-colors">
                {task.title}
            </h4>

            {/* Footer (Avatars + Comments) */}
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.id + i}`} alt="user" className="w-full h-full" />
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 text-gray-400">
                    <MessageSquare size={16} fill="currentColor" className="text-gray-300" />
                    <span className="text-xs font-bold text-gray-500">{task.comments || ((task.id * 7) % 5) + 1}</span>
                </div>
            </div>
        </div>
    );
}

function TaskColumn({ title, count, color, tasks, getPriorityStyles, onAddTask, onTaskClick, status }: {
    title: string; count: number; color: "purple" | "orange" | "green"; tasks: any[];
    getPriorityStyles: (priority: string) => string;
    onAddTask: () => void;
    onTaskClick: (task: any) => void;
    status: "TODO" | "IN_PROGRESS" | "DONE";
}) {
    // Config based on color theme
    const config = {
        purple: {
            dot: "bg-[#5453E8]",
            btn: "bg-[#5453E8] hover:bg-[#4338ca]",
            btnShadow: "shadow-indigo-200",
            total: "bg-gray-100 text-gray-500"
        },
        orange: {
            dot: "bg-[#f59e0b]",
            btn: "bg-[#f59e0b] hover:bg-[#d97706]",
            btnShadow: "shadow-amber-200",
            total: "bg-gray-100 text-gray-500"
        },
        green: {
            dot: "bg-[#22c55e]",
            btn: "bg-[#22c55e] hover:bg-[#16a34a]",
            btnShadow: "shadow-green-200",
            total: "bg-gray-100 text-gray-500"
        }
    };

    const theme = config[color];

    const [toggleTaskStatus] = useToggleTaskStatusMutation();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item: { id: number }) => {
            toggleTaskStatus({ id: item.id, body: { status } });
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop as unknown as React.LegacyRef<HTMLDivElement>} className={`flex flex-col h-full rounded-3xl transition-colors ${isOver ? "bg-gray-50/80 ring-2 ring-[#5453E8]/20" : ""}`}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${theme.total}`}>
                    {count} Total
                </div>
            </div>

            {/* Add Task Button */}
            <button
                onClick={onAddTask}
                className={`w-full py-3.5 mb-6 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${theme.btn} ${theme.btnShadow}`}
            >
                <Plus size={20} /> Add New Task
            </button>

            {/* Task List */}
            <div className="space-y-5">
                {tasks.map((task) => (
                    <DraggableTaskCard
                        key={task.id}
                        task={task}
                        getPriorityStyles={getPriorityStyles}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>
        </div>
    );
}
