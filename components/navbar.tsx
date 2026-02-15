"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Stethoscope, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loginOptions = [
        {
            title: "Patient Login",
            description: "Access your medical records",
            icon: User,
            href: "/patient/login",
            color: "text-green-600",
            bgColor: "bg-green-50",
            hoverColor: "hover:bg-green-100"
        },
        {
            title: "Doctor Login",
            description: "Manage your patients",
            icon: Stethoscope,
            href: "/doctor/login",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            hoverColor: "hover:bg-blue-100"
        },
        {
            title: "Admin Login",
            description: "System administration",
            icon: Shield,
            href: "/admin-login",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            hoverColor: "hover:bg-purple-100"
        }
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-screen-2xl px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        City<span className="text-blue-400">Care</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
                    <Link href="#home" className="text-lg font-bold hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2 decoration-primary/50">
                        Home
                    </Link>
                    <Link href="#about" className="text-lg font-bold hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2 decoration-primary/50">
                        About
                    </Link>
                    <Link href="#services" className="text-lg font-bold hover:text-foreground transition-colors hover:underline underline-offset-4 decoration-2 decoration-primary/50">
                        Services
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* Login Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center gap-2 rounded-full border border-input shadow-sm px-6 py-2.5 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                        >
                            Login
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden z-50">
                                {loginOptions.map((option) => (
                                    <div
                                        key={option.title}
                                        onClick={() => {
                                            router.push(option.href);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`flex items-start gap-4 p-4 transition-colors ${option.hoverColor} border-b border-gray-100 last:border-b-0 cursor-pointer`}
                                    >
                                        <div className={`p-2 rounded-lg ${option.bgColor}`}>
                                            <option.icon className={option.color} size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                                                {option.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="#about" className="md:hidden inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-base font-semibold shadow hover:bg-primary/90 transition-all">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
