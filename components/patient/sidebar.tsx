"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Stethoscope, // Doctors
    Calendar, // Appointments
    FileText, // Records
    User, // Profile
    LogOut,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "@/app/actions/auth";

const sidebarItems = [
    {
        name: "Dashboard",
        href: "/patient/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Find Doctors",
        href: "/patient/doctors",
        icon: Stethoscope,
    },
    {
        name: "My Appointments",
        href: "/patient/appointments",
        icon: Calendar,
    },
    {
        name: "Medical Records",
        href: "/patient/records",
        icon: FileText,
    },
    {
        name: "My Profile",
        href: "/patient/profile",
        icon: User,
    },
];

export function PatientSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<{ name: string | null; email: string } | null>(null);

    useEffect(() => {
        getCurrentUser().then((userData) => {
            if (userData) {
                setUser(userData);
            }
        });
    }, []);

    async function handleLogout() {
        await logout();
    }

    function getInitials(name: string | null, email: string): string {
        if (name) {
            const names = name.split(" ");
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="h-screen flex flex-col">
                    {/* Logo Section */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200 flex-shrink-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            CityCare Patient
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <ul className="space-y-1 px-3">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive
                                                    ? "bg-green-50 text-green-600 shadow-sm"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }
                      `}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon
                                                size={20}
                                                className={isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-500"}
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Profile / Logout Section */}
                    <div className="border-t border-gray-200 p-4 flex-shrink-0">
                        <div className="flex items-center gap-3 w-full p-2 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                                {user ? getInitials(user.name, user.email) : "P"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name || "Patient"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "Loading..."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
