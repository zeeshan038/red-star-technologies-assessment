"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2, Calendar, User, Search, Check } from "lucide-react";
import { useCreateTaskMutation } from "@/features/task/taskApi";
import { useLazySearchUsersQuery } from "@/features/auth/authApi";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE";
}

export default function CreateTaskModal({ isOpen, onClose, projectId, defaultStatus = "TODO" }: CreateTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(defaultStatus);
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState<number | null>(null);

    // User Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [searchUsers, { data: usersData, isFetching: isUserFetching }] = useLazySearchUsersQuery();

    useEffect(() => {
        if (defaultStatus) {
            setStatus(defaultStatus);
        }
    }, [defaultStatus, isOpen]);

    // Cleanup when closed
    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setDueDate("");
            setAssignedTo(null);
            setSelectedUser(null);
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isOpen]);

    // Handle Search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                searchUsers(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchUsers]);

    useEffect(() => {
        if (usersData?.data) {
            setSearchResults(usersData.data);
        }
    }, [usersData]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !projectId) return;

        try {
            await createTask({
                projectId,
                body: {
                    title,
                    description,
                    status,
                    priority,
                    due_date: dueDate || null,
                    assigned_to: assignedTo
                }
            }).unwrap();
            onClose();
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 scale-100">
                <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Title & Description */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Task Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What needs to be done?"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add more details..."
                                rows={4}
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 placeholder:text-gray-400 font-medium resize-none"
                            />
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 font-medium cursor-pointer"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Completed</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 font-medium cursor-pointer"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 font-medium"
                                />
                            </div>
                        </div>

                        {/* Assignee Search */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Assign To</label>
                            {selectedUser ? (
                                <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-[#e0e7ff] border border-[#5453E8]/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5453E8] font-bold text-xs uppercase border border-[#5453E8]/20">
                                            {selectedUser.username?.substring(0, 2) || "U"}
                                        </div>
                                        <span className="font-bold text-[#4338ca] text-sm">{selectedUser.username}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedUser(null); setAssignedTo(null); }}
                                        className="text-[#5453E8] hover:text-[#4338ca] transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setIsSearching(true); }}
                                        placeholder="Search user..."
                                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] transition-all text-gray-900 font-medium"
                                        onFocus={() => setIsSearching(true)}
                                    />

                                    {/* Search Dropdown */}
                                    {isSearching && searchQuery && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-20">
                                            {isUserFetching ? (
                                                <div className="p-4 flex justify-center text-gray-400">
                                                    <Loader2 size={20} className="animate-spin" />
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setAssignedTo(user.id);
                                                            setSearchQuery("");
                                                            setIsSearching(false);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                                                            {user.username?.substring(0, 2) || "U"}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-900 leading-snug">{user.username}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-xs text-gray-400 font-medium">No users found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || !title}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${isCreating || !title ? "bg-gray-300 cursor-not-allowed shadow-none" : "bg-[#5453E8] hover:bg-[#4338ca] shadow-indigo-200"
                                }`}
                        >
                            {isCreating && <Loader2 size={18} className="animate-spin" />}
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
