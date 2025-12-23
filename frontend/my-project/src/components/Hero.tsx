"use client";

import React from "react";
import { Button } from "./Button";
import Link from "next/link";
import { Check, MoreHorizontal, MousePointer2, Send } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
    return (
        <section className="tasktorch-gradient pt-44 pb-32 px-6 min-h-screen flex items-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[150px]" />

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000">
                    <div className="space-y-8">
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tight">
                            Empowering
                            <span className="inline-flex items-center px-4 md:px-6 h-12 md:h-16 lg:h-20 bg-white/20 backdrop-blur-xl rounded-full mx-4 border border-white/30 overflow-hidden align-middle transform hover:scale-105 transition-transform cursor-pointer">
                                <Image
                                    src="/teams-pill.png"
                                    alt="Teams"
                                    width={100}
                                    height={100}
                                    className="w-16 md:w-24 lg:w-32 h-full object-cover rounded-full"
                                />
                            </span>
                            Teams to Achieve More!
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-xl leading-relaxed font-medium">
                            Enhancing Collaborative Efforts Through Cutting-Edge Project Management Solutions.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link href="/auth/register">
                            <Button
                                className="px-10 py-5 rounded-[1.5rem] bg-[#e2e8f0]/90 text-gray-900 font-bold text-lg shadow-xl hover:bg-white hover:scale-105 transition-all"
                            >
                                Start your free trial
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="px-10 py-5 rounded-[1.5rem] border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all"
                        >
                            Request for a demo
                        </Button>
                    </div>
                </div>

                {/* Right Content - Visual Blocks */}
                <div className="relative flex items-center justify-center lg:justify-end">
                    {/* Main Character Image */}
                    <div className="relative z-10 transform lg:translate-x-12 animate-in fade-in zoom-in duration-1000 delay-200">
                        <div className="w-[320px] h-[450px] md:w-[480px] md:h-[600px] lg:w-[520px] lg:h-[650px] relative overflow-hidden rounded-[4rem] shadow-2xl ring-1 ring-white/20">
                            <img
                                src="/hero-man.png"
                                alt="Innovation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Floating Component: Completed Tasks */}
                    <div className="absolute -top-12 -right-6 lg:right-0 z-20 glass-card p-6 rounded-[2.5rem] w-72 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] animate-float">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-gray-900 text-base">Completed task</h4>
                            <MoreHorizontal size={20} className="text-gray-400" />
                        </div>
                        <div className="space-y-5">
                            {[
                                { color: "#ff6b6b", width: "45%" },
                                { color: "#4dabf7", width: "75%" },
                                { color: "#51cf66", width: "60%" }
                            ].map((task, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${task.color}20` }}>
                                        <Check size={14} style={{ color: task.color }} strokeWidth={3} />
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: task.width, backgroundColor: task.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Component: Team Efficiency */}
                    <div className="absolute -bottom-12 -left-4 lg:-left-24 z-20 glass-card p-7 rounded-[3rem] w-80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] animate-float-delayed">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 text-base">Team efficiency</h4>
                                <p className="text-sm text-green-500 font-bold flex items-center gap-1">80% Increased <span className="text-xs opacity-60">↑ +5%</span></p>
                            </div>
                            <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last 7 days</div>
                        </div>
                        <div className="flex items-end justify-between h-36 gap-2.5 pt-6">
                            {[45, 65, 50, 95, 75, 85, 55].map((h, i) => (
                                <div key={i} className="w-full flex flex-col items-center gap-2">
                                    <div className="w-full bg-[#6366f1] rounded-t-xl transition-all hover:bg-[#4f46e5] cursor-pointer shadow-sm shadow-indigo-200" style={{ height: `${h}%` }} />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                        {/* Cursor Decoration */}
                        <div className="absolute -right-6 -top-6 w-12 h-12 bg-[#6366f1] rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                            <MousePointer2 size={24} fill="white" />
                        </div>
                    </div>

                    {/* Floating Component: Satisfied Users */}
                    <div className="absolute bottom-16 right-0 lg:right-4 z-20 glass-card p-5 rounded-[2rem] shadow-xl animate-pulse flex flex-col items-center gap-3">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${i * 100 + 100} shadow-sm`} />
                            ))}
                        </div>
                        <div className="text-center">
                            <h4 className="font-black text-gray-900 text-xl leading-none">20,000 +</h4>
                            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[0.15em] mt-1">Satisfied Users</p>
                        </div>
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <Send size={14} className="text-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-float-delayed {
                    animation: float 6s ease-in-out infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
};
