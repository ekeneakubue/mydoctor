import { User, Bell, Shield } from "lucide-react";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const currentUser = await getCurrentUser();

    // If not logged in, redirect to login
    if (!currentUser) {
        redirect('/login');
    }

    // Get initials for avatar
    function getInitials(name: string | null, email: string): string {
        if (name) {
            const names = name.split(" ");
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    }
    return (
        <div className="space-y-6 max-w-5xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and system settings</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-blue-600 text-blue-600 font-medium bg-blue-50/30 whitespace-nowrap transition-colors">
                        <User size={18} />
                        Profile Settings
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium whitespace-nowrap border-b-2 border-transparent">
                        <Shield size={18} />
                        Security & Privacy
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-gray-100">
                        {currentUser.image ? (
                            <img 
                                src={currentUser.image} 
                                alt={currentUser.name || "User"}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-white font-bold border-4 border-white shadow-lg">
                                {getInitials(currentUser.name, currentUser.email)}
                            </div>
                        )}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
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

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={currentUser.name || "Not set"}
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
                                    defaultValue={currentUser.email}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-300 bg-gray-50"
                                defaultValue={currentUser.phone || "Not set"}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Role</label>
                            <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    currentUser.role === "ADMIN"
                                        ? "bg-purple-100 text-purple-800 border-purple-200"
                                        : currentUser.role === "STAFF"
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : "bg-green-100 text-green-800 border-green-200"
                                }`}>
                                    {currentUser.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Account Information</h4>
                        <div className="grid gap-4 md:grid-cols-2 text-sm">
                            <div>
                                <p className="text-gray-500">Account ID</p>
                                <p className="font-mono text-xs text-gray-900 mt-1">{currentUser.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Account Type</p>
                                <p className="text-gray-900 font-medium mt-1">System User</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Profile editing is currently view-only. To update your information, please contact a system administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
