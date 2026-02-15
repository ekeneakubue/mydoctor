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
                    <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-500 mt-1">Access your health history and clinical notes</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {records.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No medical records found</h3>
                        <p className="mt-1">Records added by your doctor will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {records.map((record) => (
                            <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date & Doctor Column */}
                                    <div className="md:w-1/4 space-y-3 border-r border-gray-100 pr-4">
                                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Calendar size={18} />
                                            {format(new Date(record.visitDate), "MMMM d, yyyy")}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Doctor</p>
                                            <p className="font-medium text-gray-900">Dr. {record.doctor.firstName} {record.doctor.lastName}</p>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <Stethoscope size={14} />
                                                {record.doctor.specialization}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Details Column */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{record.diagnosis}</h3>
                                            {record.treatment && (
                                                <p className="text-gray-600 text-sm leading-relaxed">{record.treatment}</p>
                                            )}
                                        </div>

                                        {/* Prescription Section */}
                                        {record.prescription && (
                                            <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                                                <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold text-sm">
                                                    <Pill size={16} />
                                                    Prescribed Medication
                                                </div>
                                                <p className="text-sm text-gray-800 font-medium">
                                                    {record.prescription}
                                                </p>
                                            </div>
                                        )}

                                        {/* Notes Section */}
                                        {record.notes && (
                                            <div className="pt-2 border-t border-gray-100 mt-2">
                                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Doctor's Notes</p>
                                                <p className="text-sm text-gray-600 italic">
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
