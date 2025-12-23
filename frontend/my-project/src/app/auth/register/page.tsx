import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Join | Asana",
    description: "Create an account to start managing your projects with Asana.",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-brand-light flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-deep/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

            {/* Header */}
            <header className="p-8 relative z-10">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="Asana Logo"
                        width={120}
                        height={40}
                        className="hover:opacity-80 transition-opacity"
                        priority
                    />
                </Link>
            </header>

            {/* Content */}
            <section className="flex-1 flex items-center justify-center p-6 relative z-10">
                <RegisterForm />
            </section>

            {/* Simple Footer */}
            <footer className="p-8 text-center text-xs text-gray-400 font-medium relative z-10">
                <div className="flex justify-center gap-6 mb-4">
                    <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600">Terms of Service</a>
                </div>
                <p>© 2025 Asana Clone Project. All rights reserved.</p>
            </footer>
        </main>
    );
}
