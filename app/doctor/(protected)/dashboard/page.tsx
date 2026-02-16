import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

export default async function DoctorDashboardPage() {
    const currentUser = await getCurrentUser();

    // If not logged in, redirect to doctor login
    if (!currentUser) {
        redirect('/doctor/login');
    }

    // For now, we'll show a doctor dashboard even if logged in as user
    // In production, you'd verify they're actually a doctor
    
    // Fetch statistics
    const [
        totalPatients,
        totalDoctors,
        activePatients,
        recentPatients
    ] = await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.patient.count({ where: { isActive: true } }),
        prisma.patient.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                lastVisit: true,
                isActive: true,
            }
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">Doctor dashboard</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight">Welcome, Dr. {currentUser.name?.split(' ')[0] || 'Doctor'}</h1>
                        <p className="mt-2 text-blue-100">Here's your dashboard overview for today</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="rounded-xl bg-white/20 px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs text-blue-100">Today's Date</div>
                            <div className="text-lg font-bold">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Total Patients</p>
                            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{totalPatients}</p>
                            <p className="mt-2 text-xs text-emerald-700">↑ {activePatients} active</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Users className="text-blue-700" size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Today's Appointments</p>
                            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">8</p>
                            <p className="mt-2 text-xs text-blue-700">3 remaining</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                            <Calendar className="text-emerald-700" size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Avg. Wait Time</p>
                            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">15m</p>
                            <p className="mt-2 text-xs text-orange-700">↓ 5min less</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                            <Clock className="text-orange-700" size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Satisfaction</p>
                            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">4.9</p>
                            <p className="mt-2 text-xs text-emerald-700">↑ Excellent</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                            <TrendingUp className="text-violet-700" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Schedule & Recent Patients */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Today's Schedule */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
                        <p className="mt-1 text-sm text-slate-500">Your appointments for today</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { time: '09:00 AM', patient: 'John Doe', status: 'Completed', color: 'green' },
                            { time: '10:30 AM', patient: 'Sarah Smith', status: 'In Progress', color: 'blue' },
                            { time: '02:00 PM', patient: 'Mike Johnson', status: 'Scheduled', color: 'yellow' },
                            { time: '03:30 PM', patient: 'Emily Davis', status: 'Scheduled', color: 'yellow' },
                        ].map((appointment, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                <div className="w-20 text-sm font-semibold text-slate-700">
                                    {appointment.time}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{appointment.patient}</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                        appointment.color === 'green' ? 'bg-green-100 text-green-700' :
                                        appointment.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900">Recent Patients</h2>
                        <p className="mt-1 text-sm text-slate-500">Latest patient registrations</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentPatients.length > 0 ? (
                            recentPatients.map((patient) => (
                                <div key={patient.id} className="p-4 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{patient.firstName} {patient.lastName}</p>
                                                <p className="text-sm text-slate-500">{patient.phone}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            patient.isActive 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {patient.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                No recent patients
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
                <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                        <Calendar className="text-blue-700" size={24} />
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-900">View Schedule</h3>
                    <p className="text-sm text-slate-500">Check your appointments and availability</p>
                </button>

                <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-lg">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 transition-colors group-hover:bg-emerald-200">
                        <Users className="text-emerald-700" size={24} />
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-900">My Patients</h3>
                    <p className="text-sm text-slate-500">View and manage your patient list</p>
                </button>

                <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-violet-300 hover:shadow-lg">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 transition-colors group-hover:bg-violet-200">
                        <TrendingUp className="text-violet-700" size={24} />
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-900">Reports</h3>
                    <p className="text-sm text-slate-500">View performance and statistics</p>
                </button>
            </div>
        </div>
    );
}
