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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {currentUser?.name || 'User'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        currentUser?.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                    }`}>
                        {currentUser?.role}
                    </span>
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Patient Signups</h2>
                    <a href="/admin/patients" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</a>
                </div>
                <div className="overflow-x-auto">
                    {recentPatients.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Patient Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPatients.map((patient) => (
                                    <tr key={patient.email} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
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
                            <p className="text-gray-500">No recent patient signups</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
