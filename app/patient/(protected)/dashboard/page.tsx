import { getCurrentUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Stethoscope, ArrowRight, FileText } from "lucide-react";

export default async function PatientDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch upcoming appointments
    const upcomingAppointments = await prisma.appointment.findMany({
        where: {
            patientId: user.id,
            appointmentDate: {
                gte: new Date(),
            },
            status: "SCHEDULED",
        },
        include: {
            doctor: true,
        },
        orderBy: {
            appointmentDate: "asc",
        },
        take: 3,
    });

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here is an overview of your health and schedule.
                </p>
            </div>

            {/* Stats / Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <span className="text-blue-100 text-sm font-medium">Upcoming</span>
                    </div>
                    <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
                    <p className="text-blue-100/80 text-sm">Appointments Scheduled</p>
                    <Link
                        href="/patient/appointments"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium hover:text-blue-100 transition-colors"
                    >
                        View Schedule <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                            <Stethoscope size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Find a Doctor</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Book consultations with top specialists.
                    </p>
                    <Link
                        href="/patient/doctors"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                        Browse Doctors <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                            <FileText size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Medical Records</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Access your history and prescriptions.
                    </p>
                    <Link
                        href="/patient/records"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                        View History <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Upcoming Appointments List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                    <Link href="/patient/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {upcomingAppointments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No upcoming appointments scheduled.
                        </div>
                    ) : (
                        upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-lg text-center min-w-[60px]">
                                        <div className="text-xs uppercase">{apt.appointmentDate.toLocaleString('default', { month: 'short' })}</div>
                                        <div className="text-xl">{apt.appointmentDate.getDate()}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</h4>
                                        <p className="text-sm text-gray-500">{apt.reason || "General Consultation"}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <ClockIcon />
                                            {apt.appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmed
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    )
}
