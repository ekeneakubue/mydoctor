import { User, Bell, Shield, HeartPulse } from "lucide-react";
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

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Profile & Settings</h1>
                <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-green-600 text-green-600 font-medium bg-green-50/30 whitespace-nowrap transition-colors">
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

                <div className="p-8 space-y-8">
                    {/* Header with Avatar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-gray-100">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl text-white font-bold border-4 border-white shadow-lg">
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
                            <input type="text" className="input-field" defaultValue={patient.firstName} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                            <input type="text" className="input-field" defaultValue={patient.lastName} disabled />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input type="email" className="input-field" defaultValue={patient.email} disabled />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input type="tel" className="input-field" defaultValue={patient.phone} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                            <input type="date" className="input-field"
                                defaultValue={patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : ''}
                                disabled
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Address</label>
                            <textarea className="input-field min-h-[80px]" defaultValue={patient.address || ""} disabled />
                        </div>
                    </div>

                    {/* Medical / Emergency Info */}
                    <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <HeartPulse className="text-red-500" size={20} />
                            Emergency Information
                        </h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Blood Type</label>
                                <input type="text" className="input-field" defaultValue={patient.bloodType || "Not recorded"} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Allergies</label>
                                <input type="text" className="input-field" defaultValue={patient.allergies || "None recorded"} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                                <input type="text" className="input-field" defaultValue={patient.emergencyContactName || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Emergency Contact Phone</label>
                                <input type="text" className="input-field" defaultValue={patient.emergencyContactPhone || ""} disabled />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> To update your medical history or critical personal details, please verify these changes at the clinic reception.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.625rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background-color: #f9fafb;
                    color: #111827;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }
            `}</style>
        </div>
    );
}
