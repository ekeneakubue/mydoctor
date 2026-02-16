import { User, Shield, HeartPulse } from "lucide-react";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PatientSettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch patient specific details
    const patient = await prisma.patient.findUnique({
        where: { id: user.id }
    });

    if (!patient) {
        return <div>Patient profile not found.</div>;
    }

    function getInitials(firstName: string, lastName: string): string {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    const inputClassName = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">My Profile & Settings</h1>
                <p className="mt-1 text-slate-500">Manage your personal information and preferences</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex overflow-x-auto border-b border-slate-200">
                    <button className="flex items-center gap-2 whitespace-nowrap border-b-2 border-emerald-600 bg-emerald-50/40 px-6 py-4 font-semibold text-emerald-700 transition-colors">
                        <User size={18} />
                        Personal Info
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <HeartPulse size={18} />
                        Health Data
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <Shield size={18} />
                        Security
                    </button>
                </div>

                <div className="space-y-8 p-8">
                    {/* Header with Avatar */}
                    <div className="flex flex-col items-start gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-500 to-emerald-600 text-3xl font-bold text-white shadow-lg">
                            {getInitials(patient.firstName, patient.lastName)}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Form */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                            <input type="text" className={inputClassName} defaultValue={patient.firstName} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                            <input type="text" className={inputClassName} defaultValue={patient.lastName} disabled />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input type="email" className={inputClassName} defaultValue={patient.email} disabled />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input type="tel" className={inputClassName} defaultValue={patient.phone} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                            <input type="date" className={inputClassName}
                                defaultValue={patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : ''}
                                disabled
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Address</label>
                            <textarea className={`${inputClassName} min-h-[80px]`} defaultValue={patient.address || ""} disabled />
                        </div>
                    </div>

                    {/* Medical / Emergency Info */}
                    <div className="border-t border-slate-100 pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <HeartPulse className="text-red-500" size={20} />
                            Emergency Information
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Blood Type</label>
                                <input type="text" className={inputClassName} defaultValue={patient.bloodType || "Not recorded"} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Allergies</label>
                                <input type="text" className={inputClassName} defaultValue={patient.allergies || "None recorded"} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                                <input type="text" className={inputClassName} defaultValue={patient.emergencyContactName || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Emergency Contact Phone</label>
                                <input type="text" className={inputClassName} defaultValue={patient.emergencyContactPhone || ""} disabled />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> To update your medical history or critical personal details, please verify these changes at the clinic reception.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
