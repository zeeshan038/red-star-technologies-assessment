"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className='m-4 z-50 transition-all duration-300'
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={200}
                        height={200}
                    />
                </Link>
                <div className="hidden lg:flex items-center">
                    <Link href="/auth/login">
                        <Button
                            variant="white"
                            className={`px-8 cursor-pointer py-2.5 rounded-xl font-bold transition-colors ${isScrolled
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "bg-white text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            Login
                        </Button>
                    </Link>
                </div>
                <button
                    className={`lg:hidden p-2 ${isScrolled ? "text-gray-900" : "text-white"}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};
