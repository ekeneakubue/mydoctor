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
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome, Dr. {currentUser.name?.split(' ')[0] || 'Doctor'}</h1>
                        <p className="text-blue-100 mt-2">Here's your dashboard overview for today</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <div className="text-xs text-blue-100">Today's Date</div>
                            <div className="text-lg font-semibold">
                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalPatients}</p>
                            <p className="text-xs text-green-600 mt-2">↑ {activePatients} active</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Today's Appointments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                            <p className="text-xs text-blue-600 mt-2">3 remaining</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                            <Calendar className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Avg. Wait Time</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">15m</p>
                            <p className="text-xs text-orange-600 mt-2">↓ 5min less</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                            <Clock className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Satisfaction</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">4.9</p>
                            <p className="text-xs text-green-600 mt-2">↑ Excellent</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Schedule & Recent Patients */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                        <p className="text-sm text-gray-500 mt-1">Your appointments for today</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { time: '09:00 AM', patient: 'John Doe', status: 'Completed', color: 'green' },
                            { time: '10:30 AM', patient: 'Sarah Smith', status: 'In Progress', color: 'blue' },
                            { time: '02:00 PM', patient: 'Mike Johnson', status: 'Scheduled', color: 'yellow' },
                            { time: '03:30 PM', patient: 'Emily Davis', status: 'Scheduled', color: 'yellow' },
                        ].map((appointment, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-20 text-sm font-semibold text-gray-700">
                                    {appointment.time}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{appointment.patient}</p>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
                        <p className="text-sm text-gray-500 mt-1">Latest patient registrations</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentPatients.length > 0 ? (
                            recentPatients.map((patient) => (
                                <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                                                <p className="text-sm text-gray-500">{patient.phone}</p>
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
                            <div className="p-8 text-center text-gray-500">
                                No recent patients
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
                <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-300 text-left group">
                    <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">View Schedule</h3>
                    <p className="text-sm text-gray-500">Check your appointments and availability</p>
                </button>

                <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-green-300 text-left group">
                    <div className="w-12 h-12 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
                        <Users className="text-green-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">My Patients</h3>
                    <p className="text-sm text-gray-500">View and manage your patient list</p>
                </button>

                <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-purple-300 text-left group">
                    <div className="w-12 h-12 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
                        <TrendingUp className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
                    <p className="text-sm text-gray-500">View performance and statistics</p>
                </button>
            </div>
        </div>
    );
}
