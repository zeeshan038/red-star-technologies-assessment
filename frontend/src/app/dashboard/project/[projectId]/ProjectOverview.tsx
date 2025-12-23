"use client";
import React from "react";
import {
    LayoutList,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart,
    Activity,
    Loader2
} from "lucide-react";
import { useGetProjectAnalyticsQuery } from "@/features/project/projectApi";

interface ProjectOverviewProps {
    projectId: string;
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
    const { data: analyticsData, isLoading } = useGetProjectAnalyticsQuery(projectId, {
        skip: !projectId
    });

    if (isLoading) {
        return (
            <div className="flex py-20 items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#5453E8] opacity-20" />
            </div>
        );
    }

    const analytics = analyticsData?.data;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Project Info Header */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{analytics?.project?.name}</h2>
                        <p className="text-gray-500 max-w-2xl">{analytics?.project?.description || "No description provided for this project."}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                        <span className="px-4 py-2 bg-gray-100/50 rounded-2xl border border-gray-100">
                            Created: {analytics?.project?.created_at ? new Date(analytics.project.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tasks"
                    value={analytics?.stats?.totalTasks || 0}
                    icon={<LayoutList className="text-[#5453E8]" size={24} />}
                    color="bg-indigo-50"
                />
                <StatCard
                    title="Completed"
                    value={analytics?.stats?.statusCounts?.DONE || 0}
                    icon={<CheckCircle2 className="text-green-500" size={24} />}
                    color="bg-green-50"
                />
                <StatCard
                    title="In Progress"
                    value={analytics?.stats?.statusCounts?.IN_PROGRESS || 0}
                    icon={<Clock className="text-orange-500" size={24} />}
                    color="bg-orange-50"
                />
                <StatCard
                    title="To Do"
                    value={analytics?.stats?.statusCounts?.TODO || 0}
                    icon={<AlertCircle className="text-gray-400" size={24} />}
                    color="bg-gray-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress & Distribution */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-deep/5 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart size={20} className="text-[#5453E8]" />
                            Project Progress
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-4xl font-extrabold text-gray-900">{analytics?.stats?.progress || 0}%</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completion Rate</span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#5453E8] to-[#807ef1] rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics?.stats?.progress || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Priority Distribution</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'High', count: analytics?.stats?.priorityCounts?.HIGH || 0, color: 'bg-red-500', bg: 'bg-red-100' },
                                { label: 'Medium', count: analytics?.stats?.priorityCounts?.MEDIUM || 0, color: 'bg-blue-500', bg: 'bg-blue-100' },
                                { label: 'Low', count: analytics?.stats?.priorityCounts?.LOW || 0, color: 'bg-amber-500', bg: 'bg-amber-100' }
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="text-gray-900">{item.count}</span>
                                    </div>
                                    <div className={`w-full h-2 ${item.bg} rounded-full`}>
                                        <div
                                            className={`h-full ${item.color} rounded-full`}
                                            style={{ width: analytics?.stats?.totalTasks > 0 ? `${(item.count / analytics.stats.totalTasks) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={20} className="text-[#5453E8]" />
                                Recent Activity
                            </h3>
                            <button className="text-xs font-bold text-[#5453E8] hover:underline uppercase tracking-widest">
                                View Logs
                            </button>
                        </div>

                        <div className="space-y-6">
                            {analytics?.recentActivity?.length > 0 ? (
                                analytics.recentActivity.map((log: any, idx: number) => (
                                    <div key={log.id} className="flex gap-4 group">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-[#5453E8] font-bold text-sm shrink-0">
                                                {log.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            {idx !== analytics.recentActivity.length - 1 && (
                                                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-10 bg-gray-100" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6 border-b border-gray-50">
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                <span className="font-bold text-gray-900">{log.user?.name}</span>
                                                {" "}{log.action}{" "}
                                                <span className="font-bold text-[#5453E8]">"{log.task?.title || 'Task'}"</span>
                                            </p>
                                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                                {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-400">
                                    <Activity size={48} className="mx-auto mb-4 opacity-10" />
                                    <p className="font-medium">No recent activity found for this project.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
    return (
        <div className={`p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-deep/5 transition-all duration-500 bg-white group`}>
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h4>
                </div>
            </div>
        </div>
    );
}
