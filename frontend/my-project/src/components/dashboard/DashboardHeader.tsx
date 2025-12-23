"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, LogOut, Menu as MenuIcon, ChevronDown, Check } from "lucide-react";

interface DashboardHeaderProps {
    selectedWorkspace: string;
    selectedWorkspaceId: string | null;
    workspaces: any[];
    onWorkspaceSelect: (id: string, name: string) => void;
    onMenuClick: () => void;
    onCreateWorkspaceClick: () => void;
    user: { name: string; email: string } | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    selectedWorkspace,
    selectedWorkspaceId,
    workspaces,
    onWorkspaceSelect,
    onMenuClick,
    onCreateWorkspaceClick,
    user
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const workspaceMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(event.target as Node)) {
                setIsWorkspaceMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
    };

    return (
        <header className="h-14 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 bg-white shrink-0 z-20">
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500"
                >
                    <MenuIcon size={20} />
                </button>

                {/* Workspace Selector Dropdown */}
                <div className="relative" ref={workspaceMenuRef}>
                    <button
                        onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                        className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                    >
                        <h2 className="font-bold text-sm lg:text-base text-gray-900 truncate max-w-[120px] lg:max-w-none">{selectedWorkspace || "Select Workspace"}</h2>
                        <div className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isWorkspaceMenuOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    </button>

                    {isWorkspaceMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                                Your Workspaces
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {workspaces?.map((ws) => (
                                    <button
                                        key={ws.id}
                                        onClick={() => {
                                            onWorkspaceSelect(ws.id, ws.name);
                                            setIsWorkspaceMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-left group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-brand-deep/10 text-brand-deep flex items-center justify-center text-[10px] font-bold">
                                                {ws.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-sm font-medium ${selectedWorkspaceId === ws.id ? 'text-brand-deep' : 'text-gray-700'}`}>
                                                {ws.name}
                                            </span>
                                        </div>
                                        {selectedWorkspaceId === ws.id && (
                                            <Check size={14} className="text-brand-deep" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 border-t border-gray-50 mt-1">
                                <button
                                    onClick={() => {
                                        onCreateWorkspaceClick();
                                        setIsWorkspaceMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <Plus size={14} /> Create New
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden sm:block h-6 w-[1px] bg-gray-100 mx-1 lg:mx-2" />
            </div>

            <div className="flex items-center gap-2 lg:gap-5">
                <div className="flex items-center gap-2 lg:gap-3">
                    {/* User Avatar & Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="w-8 h-8 cursor-pointer rounded-full bg-brand-pink text-brand-deep flex items-center justify-center font-bold text-xs ring-2 ring-white hover:ring-brand-deep/10 transition-all shadow-md"
                        >
                            {user ? getInitials(user.name) : "U"}
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-[#1e1f21] rounded-2xl shadow-2xl border border-white/5 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                {/* Dropdown Header */}
                                <div className="px-6 py-4 flex flex-col items-center border-b border-white/5">
                                    <div className="w-16 h-16 rounded-full bg-[#bf95f9] text-[#2c1a4d] flex items-center justify-center text-xl font-bold mb-3 shadow-inner">
                                        {user ? getInitials(user.name) : "U"}
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-0.5">
                                            <h3 className="text-white font-bold text-lg">My Account</h3>
                                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium">{user?.email || "user@example.com"}</p>
                                    </div>
                                </div>

                                <div className="py-2 cursor-pointer">
                                    <button
                                        onClick={() => {
                                            onCreateWorkspaceClick();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="w-full"
                                    >
                                        <DropdownItem icon={<Plus size={18} />} label="New workspace" />
                                    </button>
                                </div>
                                <div className="h-[1px] bg-white/5 mx-2" />
                                <div className="py-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left cursor-pointer"
                                    >
                                        <LogOut size={18} />
                                        <span className="font-semibold cursor-pointer">Log out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

function DropdownItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="w-full flex items-center gap-3 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left group">
            <span className="text-gray-400 group-hover:text-white transition-colors">{icon}</span>
            <span className="font-semibold">{label}</span>
        </div>
    );
}
