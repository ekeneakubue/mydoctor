"use client";

import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateDoctor } from "@/app/actions/doctor-actions";
import { Doctor } from "@prisma/client";

interface EditDoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor;
    onSuccess: () => void;
}

const specializations = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Internal Medicine",
    "Psychiatry",
    "Radiology",
    "Anesthesiology",
    "Emergency Medicine",
    "Family Medicine",
    "Surgery",
    "Obstetrics & Gynecology",
    "Oncology",
    "Ophthalmology",
    "Other"
];

export function EditDoctorModal({ isOpen, onClose, doctor, onSuccess }: EditDoctorModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setError(null);
        setIsLoading(false);
        setShowPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Doctor</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={async (formData) => {
                    setIsLoading(true);
                    setError(null);

                    const result = await updateDoctor(doctor.id, formData);
                    setIsLoading(false);

                    if (result.success) {
                        onSuccess();
                        handleClose();
                    } else {
                        setError(result.error || "Something went wrong");
                    }
                }} className="p-6 space-y-5">

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">First Name *</label>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="e.g. John"
                                defaultValue={doctor.firstName}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Last Name *</label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="e.g. Doe"
                                defaultValue={doctor.lastName}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Specialization *</label>
                            <select 
                                name="specialization"
                                defaultValue={doctor.specialization}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                            >
                                <option value="">Select specialization</option>
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <input
                                name="department"
                                type="text"
                                placeholder="e.g. Cardiology Department"
                                defaultValue={doctor.department || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">License Number *</label>
                            <input
                                name="licenseNumber"
                                type="text"
                                placeholder="e.g. MD-12345"
                                defaultValue={doctor.licenseNumber}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone *</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="e.g. +1 234 567 8900"
                                defaultValue={doctor.phone}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email *</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="e.g. doctor@citycare.com"
                                defaultValue={doctor.email}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                                <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address *</label>
                        <textarea
                            name="address"
                            placeholder="e.g. 123 Medical Center Dr, Suite 100"
                            defaultValue={doctor.address}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            value="true"
                            defaultChecked={doctor.isActive}
                            id="isActive-edit"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500/20"
                        />
                        <label htmlFor="isActive-edit" className="text-sm font-medium text-gray-700">
                            Active Doctor
                        </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Updating...
                                </>
                            ) : (
                                "Update Doctor"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
