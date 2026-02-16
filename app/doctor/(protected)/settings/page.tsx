import { User, Bell, Shield, Stethoscope } from "lucide-react";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
    const currentUser = await getCurrentUser();

    // If not logged in, redirect to login
    if (!currentUser) {
        redirect('/doctor/login');
    }

    // Fetch doctor specific details
    const doctor = await prisma.doctor.findUnique({
        where: { id: currentUser.id }
    });

    if (!doctor) {
        // Handle case where user is logged in but no doctor record found (should ideally not happen if role checks are in place)
        return <div>Doctor profile not found.</div>;
    }

    // Get initials for avatar
    function getInitials(firstName: string, lastName: string): string {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Settings</h1>
                <p className="mt-1 text-slate-500">Manage your account preferences and professional profile</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex overflow-x-auto border-b border-slate-200">
                    <button className="flex items-center gap-2 whitespace-nowrap border-b-2 border-blue-600 bg-blue-50/40 px-6 py-4 font-semibold text-blue-700 transition-colors">
                        <User size={18} />
                        Profile Settings
                    </button>
                    {/* Placeholder tabs for future functionality */}
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <Shield size={18} />
                        Security & Privacy
                    </button>
                </div>

                <div className="space-y-8 p-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-start gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-lg">
                            {getInitials(doctor.firstName, doctor.lastName)}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-slate-900">Profile Picture</h3>
                            <p className="max-w-xs text-sm text-slate-500">
                                Upload a new avatar. Recommended size is 256x256px.
                            </p>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                                    Change
                                </button>
                                <button className="px-4 py-2 bg-white border border-transparent rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={doctor.firstName}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={doctor.lastName}
                                disabled
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                    defaultValue={doctor.email}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={doctor.phone}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Specialization</label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                    defaultValue={doctor.specialization}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">License Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={doctor.licenseNumber}
                                disabled
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Address</label>
                            <textarea
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50 resize-y min-h-[80px]"
                                defaultValue={doctor.address}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="mb-4 text-sm font-semibold text-slate-700">Account Information</h4>
                        <div className="grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                                <p className="text-gray-500">Account ID</p>
                                <p className="font-mono text-xs text-gray-900 mt-1">{doctor.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Account Type</p>
                                <p className="text-gray-900 font-medium mt-1">Doctor</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mt-1 ${doctor.isActive
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }`}>
                                    {doctor.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500">Joined</p>
                                <p className="text-gray-900 font-medium mt-1">
                                    {new Date(doctor.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> To update your professional details or license information, please contact the hospital administration.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
