"use client";

import React, { useState } from "react";
import {
    X,
    Briefcase,
    Users,
    ArrowRight,
    Loader2,
    Building2,
    Globe,
    Lock
} from "lucide-react";
import { Button } from "@/components/Button";
import { useCreateWorkspaceMutation } from "@/features/workspace/workspaceApi";

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
    const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
    const [workspaceName, setWorkspaceName] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!workspaceName.trim()) {
            setError("Workspace name is required");
            return;
        }

        try {
            const result = await createWorkspace({ name: workspaceName }).unwrap();

            if (result.status) {
                onClose();
            }
            setWorkspaceName("");
        } catch (err: any) {
            setError(err.data?.msg || "Failed to create workspace. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#1e1f21]/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="absolute top-6 right-8">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="mb-10">
                        <div className="w-16 h-16 bg-brand-deep/5 rounded-2xl flex items-center justify-center mb-6 text-brand-deep">
                            <Building2 size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Create your workspace</h2>
                        <p className="text-gray-500 text-lg">Workspaces are shared places where teams can work on projects and tasks.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 ml-1">Workspace Name</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-deep w-5 h-5 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Marketing Team or Acme Corp"
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-brand-deep/5 focus:border-brand-deep outline-none transition-all text-lg"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm font-medium ml-1">{error}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col gap-3">
                                <div className="p-2 w-fit bg-white rounded-lg shadow-sm">
                                    <Globe size={18} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Public</p>
                                    <p className="text-xs text-gray-500">Anyone in your organization can join.</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl border border-brand-deep/10 bg-brand-deep/[0.02] flex flex-col gap-3 ring-2 ring-brand-deep/5">
                                <div className="p-2 w-fit bg-brand-deep text-white rounded-lg shadow-sm">
                                    <Lock size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Private</p>
                                    <p className="text-xs text-brand-deep/60">Only people you invite can join.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full py-5 text-lg font-bold group shadow-xl shadow-brand-deep/10"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Create Workspace
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-3 text-gray-400">
                        <Users size={18} />
                        <p className="text-xs font-medium">You can invite team members after creating the workspace.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
