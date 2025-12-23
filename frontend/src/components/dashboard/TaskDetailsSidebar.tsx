"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2, Calendar, User, Search, Trash2, Edit2, Check, Clock, AlertCircle } from "lucide-react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "@/features/task/taskApi";
import { useLazySearchUsersQuery } from "@/features/auth/authApi";

interface TaskDetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    task: any; // Using any for now to match other parts, but ideally Task interface
}

export default function TaskDetailsSidebar({ isOpen, onClose, task }: TaskDetailsSidebarProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState<number | null>(null);

    // User Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
    const [searchUsers, { data: usersData, isFetching: isUserFetching }] = useLazySearchUsersQuery();

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setStatus(task.status || "TODO");
            setPriority(task.priority || "MEDIUM");
            setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "");
            setAssignedTo(task.assigned_to || null);
            // If we had user details in task, we'd set selectedUser here
            // For now, if assigned_to is present but no user object, maybe we fetch or just leave generic?
            // Assuming task might have 'assignee' object or similar if populated?
            // If not, we might need to fetch the user or just show ID. 
            // For now let's assume we can't show the name if purely just ID is passed unless we fetch list.
            // But usually getAllTasks might include expanded user?
            // Let's check previous getAllTask response... 
            // The user showed: "assigned_to": 2. No user object.
            // So we might just show "User ID: 2" or try to fetch.
        }
    }, [task, isOpen]);

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


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateTask({
                id: task.id,
                body: {
                    title,
                    description,
                    status,
                    priority,
                    due_date: dueDate || null,
                    assigned_to: assignedTo
                }
            }).unwrap();
            setIsEditing(false);
            // onClose(); // Optional: close or keep open? User might want to see changes. Let's keep open.
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(task.id).unwrap();
                onClose();
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col p-6 overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 text-gray-500 hover:text-[#5453E8] hover:bg-[#e0e7ff] rounded-full transition-all"
                                    title="Edit Task"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                    title="Delete Task"
                                >
                                    {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 bg-gray-100 rounded-lg"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-6 flex-1">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-bold text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-medium text-gray-900 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-bold text-gray-700"
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-bold text-gray-700"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-medium text-gray-900"
                            />
                        </div>

                        {/* Assignee Search Simply Reuse */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Assign To</label>
                            {selectedUser || assignedTo ? (
                                <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#e0e7ff] border border-[#5453E8]/30">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-[#5453E8]" />
                                        <span className="font-bold text-[#4338ca] text-sm">
                                            {selectedUser ? selectedUser.username : `User ID: ${assignedTo}`}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedUser(null); setAssignedTo(null); }}
                                        className="text-[#5453E8] hover:text-[#4338ca]"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => { setSearchQuery(e.target.value); setIsSearching(true); }}
                                        placeholder="Search user..."
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5453E8]/20 focus:border-[#5453E8] font-medium text-gray-900"
                                    />
                                    {isSearching && searchQuery && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-20">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setAssignedTo(user.id);
                                                            setSearchQuery("");
                                                            setIsSearching(false);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50"
                                                    >
                                                        <div className="text-sm font-bold text-gray-900">{user.username}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-center text-xs text-gray-400">No users found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full py-3 rounded-xl bg-[#5453E8] hover:bg-[#4338ca] text-white font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8 flex-1">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">{task.title}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${task.status === "TODO" ? "bg-purple-100 text-purple-700" :
                                        task.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-700" :
                                            "bg-green-100 text-green-700"
                                    }`}>
                                    {task.status?.replace("_", " ")}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${task.priority === "HIGH" ? "bg-red-100 text-red-700" :
                                        task.priority === "MEDIUM" ? "bg-blue-100 text-blue-700" :
                                            "bg-amber-100 text-amber-700"
                                    }`}>
                                    {task.priority} Priority
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="p-2 rounded-lg bg-gray-50 text-gray-400 mt-1">
                                    <AlertCircle size={18} />
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                                    <p className="text-gray-700 font-medium leading-relaxed">
                                        {task.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-gray-50 text-gray-400">
                                    <Clock size={18} />
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</h4>
                                    <p className="text-gray-900 font-bold">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-gray-50 text-gray-400">
                                    <User size={18} />
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned To</h4>
                                    <p className="text-gray-900 font-bold">
                                        {task.assigned_to ? `User #${task.assigned_to}` : "Unassigned"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
