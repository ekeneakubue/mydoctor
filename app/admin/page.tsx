import { StatCard } from "@/components/admin/stat-card";
import { Activity, Calendar, Users, UserPlus, Stethoscope, UserCog } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";

export default async function DashboardPage() {
    // Fetch current user
    const currentUser = await getCurrentUser();

    // Fetch real statistics from database
    const [
        totalPatients,
        totalDoctors,
        totalUsers,
        activePatients,
        activeDoctors,
        recentPatients
    ] = await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.user.count(),
        prisma.patient.count({ where: { isActive: true } }),
        prisma.doctor.count({ where: { isActive: true } }),
        prisma.patient.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                createdAt: true,
            }
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">Admin dashboard</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">Platform Overview</h1>
                        <p className="mt-2 text-violet-100">Welcome back, {currentUser?.name || 'User'}. Monitor users, teams, and growth from one place.</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        currentUser?.role === "ADMIN"
                            ? "bg-white/20 text-white"
                            : "bg-blue-100/30 text-blue-50"
                    }`}>
                        {currentUser?.role}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Core Metrics</h2>
                    <p className="mt-1 text-slate-500">Real-time overview of records in the system</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Patients"
                    value={totalPatients.toString()}
                    icon={Users}
                    trend={`${activePatients} active`}
                    trendUp={true}
                />
                <StatCard
                    label="Total Doctors"
                    value={totalDoctors.toString()}
                    icon={Stethoscope}
                    trend={`${activeDoctors} active`}
                    trendUp={true}
                />
                <StatCard
                    label="System Users"
                    value={totalUsers.toString()}
                    icon={UserCog}
                    trend="Admins & Staff"
                    trendUp={true}
                />
                <StatCard
                    label="Recent Signups"
                    value={recentPatients.length.toString()}
                    icon={UserPlus}
                    trend="Last 5 patients"
                    trendUp={true}
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Recent Patient Signups</h2>
                    <a href="/admin/patients" className="text-sm font-semibold text-violet-700 hover:text-violet-800">View All</a>
                </div>
                <div className="overflow-x-auto">
                    {recentPatients.length > 0 ? (
                        <table className="w-full text-left text-sm text-slate-500">
                            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentPatients.map((patient) => (
                                    <tr key={patient.email} className="transition-colors hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {patient.firstName} {patient.lastName}
                                        </td>
                                        <td className="px-6 py-4">{patient.email}</td>
                                        <td className="px-6 py-4">{patient.phone}</td>
                                        <td className="px-6 py-4">
                                            {new Date(patient.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-slate-500">No recent patient signups</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
