"use client";

import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegisterMutation } from "@/features/auth/authApi";



export const RegisterForm = () => {
    const [register, { isLoading }] = useRegisterMutation();
    const [error, setError] = useState("");
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await register(formData).unwrap();
            console.log("res", res);
            if (res.status) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data));
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.data?.msg || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-brand-deep/10 border border-gray-100 p-8 sm:p-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Create account</h1>
                    <p className="text-gray-500">Start organizing your projects today.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-center gap-3">
                        <AlertCircle size={18} className="shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-deep transition-colors" />
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-deep/5 focus:border-brand-deep outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-deep transition-colors" />
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-deep/5 focus:border-brand-deep outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-brand-deep transition-colors" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-deep/5 focus:border-brand-deep outline-none transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-4 text-base font-bold group cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <span className="flex items-center gap-2">
                                Create account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-brand-deep font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
