import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { FileText, Calendar, Stethoscope, Clock, Pill } from "lucide-react";

export default async function MedicalRecordsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const records = await prisma.medicalRecord.findMany({
        where: {
            patientId: user.id
        },
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    specialization: true
                }
            }
        },
        orderBy: {
            visitDate: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Medical Records</h1>
                    <p className="mt-1 text-slate-500">Access your health history and clinical notes</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {records.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900">No medical records found</h3>
                        <p className="mt-1">Records added by your doctor will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <div key={record.id} className="p-6 transition-colors hover:bg-slate-50">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date & Doctor Column */}
                                    <div className="space-y-3 border-r border-slate-100 pr-4 md:w-1/4">
                                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Calendar size={18} />
                                            {format(new Date(record.visitDate), "MMMM d, yyyy")}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Doctor</p>
                                            <p className="font-semibold text-slate-900">Dr. {record.doctor.firstName} {record.doctor.lastName}</p>
                                            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                                <Stethoscope size={14} />
                                                {record.doctor.specialization}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Details Column */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="mb-1 text-lg font-bold text-slate-900">{record.diagnosis}</h3>
                                            {record.treatment && (
                                                <p className="text-sm leading-relaxed text-slate-600">{record.treatment}</p>
                                            )}
                                        </div>

                                        {/* Prescription Section */}
                                        {record.prescription && (
                                            <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
                                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
                                                    <Pill size={16} />
                                                    Prescribed Medication
                                                </div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {record.prescription}
                                                </p>
                                            </div>
                                        )}

                                        {/* Notes Section */}
                                        {record.notes && (
                                            <div className="mt-2 border-t border-slate-100 pt-2">
                                                <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Doctor's Notes</p>
                                                <p className="text-sm italic text-slate-600">
                                                    "{record.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
