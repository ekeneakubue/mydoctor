"use client";

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
import { usePathname } from "next/navigation";
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
            <button
                className="fixed right-4 top-4 z-50 rounded-xl border border-slate-300 bg-white p-2.5 text-slate-700 shadow lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside
                className={`
          fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="h-screen flex flex-col">
                    <div className="h-20 border-b border-slate-200 px-5 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">MyDoctor</p>
                        <h1 className="mt-1 text-xl font-black text-slate-900">Patient Workspace</h1>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <ul className="space-y-1.5 px-3">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200
                        ${isActive
                                                    ? "bg-emerald-100 text-emerald-800 shadow-sm"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                }
                      `}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <item.icon
                                                size={20}
                                                className={isActive ? "text-emerald-700" : "text-slate-400"}
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="border-t border-slate-200 p-4 flex-shrink-0">
                        <div className="flex items-center gap-3 w-full rounded-xl bg-slate-100 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                                {user ? getInitials(user.name, user.email) : "P"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {user?.name || "Patient"}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {user?.email || "Loading..."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
