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
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">Patient dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">
                    Welcome back, {user.name?.split(" ")[0]}!
                </h1>
                <p className="mt-2 text-emerald-100">
                    Here is your care summary with quick access to appointments, doctors, and records.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                            <Calendar size={22} />
                        </div>
                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wider">Upcoming</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">{upcomingAppointments.length}</h3>
                    <p className="text-slate-500 text-sm">Appointments Scheduled</p>
                    <Link
                        href="/patient/appointments"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
                    >
                        View Schedule <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                            <Stethoscope size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Find a Doctor</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Book consultations with top specialists.
                    </p>
                    <Link
                        href="/patient/doctors"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        Browse Doctors <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                            <FileText size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Medical Records</h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Access your history and prescriptions.
                    </p>
                    <Link
                        href="/patient/records"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-violet-700 hover:text-violet-800 transition-colors"
                    >
                        View History <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
                    <Link href="/patient/appointments" className="text-sm font-semibold text-blue-700 hover:text-blue-800">View All</Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {upcomingAppointments.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No upcoming appointments scheduled.
                        </div>
                    ) : (
                        upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="min-w-[60px] rounded-lg bg-blue-100 p-3 text-center font-bold text-blue-700">
                                        <div className="text-xs uppercase">{apt.appointmentDate.toLocaleString('default', { month: 'short' })}</div>
                                        <div className="text-xl">{apt.appointmentDate.getDate()}</div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Dr. {apt.doctor.firstName} {apt.doctor.lastName}</h4>
                                        <p className="text-sm text-slate-500">{apt.reason || "General Consultation"}</p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                            <ClockIcon />
                                            {apt.appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
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
