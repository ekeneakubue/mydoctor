import { getCurrentUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, Stethoscope } from "lucide-react";

export default async function MyAppointmentsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            patientId: user.id
        },
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    specialization: true,
                    address: true
                }
            }
        },
        orderBy: {
            appointmentDate: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">My Appointments</h1>
                    <p className="mt-1 text-slate-500">Manage new booking and view history</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {appointments.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900">No appointments yet</h3>
                        <p className="mt-1">Book your first consultation with our specialists.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {appointments.map((apt) => {
                            const isPast = new Date(apt.appointmentDate) < new Date();
                            return (
                                <div key={apt.id} className="p-6 transition-colors hover:bg-slate-50">
                                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                                        <div className="flex gap-4">
                                            {/* Date Box */}
                                            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border ${isPast ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-blue-50 border-blue-100 text-blue-600"
                                                }`}>
                                                <span className="text-xs font-bold uppercase">{format(apt.appointmentDate, "MMM")}</span>
                                                <span className="text-xl font-bold">{format(apt.appointmentDate, "d")}</span>
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                                                    Dr. {apt.doctor.firstName} {apt.doctor.lastName}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${apt.status === "SCHEDULED" ? "bg-green-50 text-green-700 border-green-200" :
                                                            apt.status === "COMPLETED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                "bg-gray-50 text-gray-600 border-gray-200"
                                                        }`}>
                                                        {apt.status}
                                                    </span>
                                                </h3>
                                                <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                                                    <Stethoscope size={14} />
                                                    {apt.doctor.specialization}
                                                </p>
                                                <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {format(apt.appointmentDate, "h:mm a")}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {apt.doctor.address || "Main Clinic"}
                                                    </span>
                                                </div>
                                                {apt.reason && (
                                                    <p className="mt-2 text-sm italic text-slate-500">
                                                        "{apt.reason}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions (Future) */}
                                        <div className="flex items-center">
                                            {/* Actions like Cancel/Reschedule could go here */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
