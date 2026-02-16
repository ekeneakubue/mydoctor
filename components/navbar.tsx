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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                        My<span className="text-sky-600">Doctor</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 text-base font-medium text-slate-600 md:flex">
                    <Link href="#home" className="text-sm font-bold uppercase tracking-wider transition-colors hover:text-slate-900">
                        Home
                    </Link>
                    <Link href="#about" className="text-sm font-bold uppercase tracking-wider transition-colors hover:text-slate-900">
                        About
                    </Link>
                    <Link href="#services" className="text-sm font-bold uppercase tracking-wider transition-colors hover:text-slate-900">
                        Services
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* Login Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
                        >
                            Login
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                {loginOptions.map((option) => (
                                    <button
                                        key={option.title}
                                        onClick={() => {
                                            router.push(option.href);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full cursor-pointer border-b border-slate-100 p-4 text-left transition-colors last:border-b-0 ${option.hoverColor}`}
                                    >
                                        <div className={`rounded-lg p-2 ${option.bgColor}`}>
                                            <option.icon className={option.color} size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-0.5 text-sm font-semibold text-slate-900">
                                                {option.title}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="#about" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-slate-800 md:hidden">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
