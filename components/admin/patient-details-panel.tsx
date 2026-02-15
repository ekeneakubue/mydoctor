"use client";

import { X, Mail, Phone, MapPin, Heart, Droplet, Calendar, Shield, AlertCircle, User as UserIcon, FileText } from "lucide-react";
import { Patient } from "@prisma/client";

interface PatientDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
}

function calculateAge(dateOfBirth: Date | null): number {
    if (!dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function formatDate(date: Date | null): string {
    if (!date) return "Not specified";
    
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function PatientDetailsPanel({ isOpen, onClose, patient }: PatientDetailsPanelProps) {
    if (!isOpen || !patient) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Center Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-[50%] min-w-[600px] max-h-[90vh] bg-white shadow-2xl rounded-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300 overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg z-10 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                                {getInitials(patient.firstName, patient.lastName)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {patient.firstName} {patient.lastName}
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    Patient ID: {patient.id.substring(0, 8)}...
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : "-"}</div>
                            <div className="text-xs text-blue-100">Years Old</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{patient.bloodType || "-"}</div>
                            <div className="text-xs text-blue-100">Blood Type</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-xs text-blue-100 mb-1">Status</div>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                patient.isActive 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-400 text-white"
                            }`}>
                                {patient.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserIcon size={20} className="text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{patient.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={18} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "Not specified"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <UserIcon size={18} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                                    <p className="text-sm font-medium text-gray-900 capitalize">
                                        {patient.gender ? patient.gender.toLowerCase() : "Not specified"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {patient.address || "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Medical Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart size={20} className="text-red-600" />
                            Medical Information
                        </h3>
                        <div className="bg-red-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <Droplet size={18} className="text-red-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-red-700 uppercase tracking-wide">Blood Type</p>
                                    <p className="text-sm font-medium text-gray-900">{patient.bloodType || "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-red-700 uppercase tracking-wide">Allergies</p>
                                    <p className="text-sm font-medium text-gray-900">{patient.allergies || "None reported"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText size={18} className="text-red-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-red-700 uppercase tracking-wide">Medical History</p>
                                    <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                                        {patient.medicalHistory || "No medical history recorded"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Insurance Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-green-600" />
                            Insurance Information
                        </h3>
                        <div className="bg-green-50 rounded-xl p-4 space-y-3">
                            <div>
                                <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Provider</p>
                                <p className="text-sm font-medium text-gray-900">{patient.insuranceProvider || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Policy Number</p>
                                <p className="text-sm font-medium text-gray-900">{patient.insuranceNumber || "Not specified"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contact */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-orange-600" />
                            Emergency Contact
                        </h3>
                        <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                            <div>
                                <p className="text-xs text-orange-700 uppercase tracking-wide mb-1">Contact Name</p>
                                <p className="text-sm font-medium text-gray-900">{patient.emergencyContactName || "Not specified"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-orange-700 uppercase tracking-wide mb-1">Contact Phone</p>
                                <p className="text-sm font-medium text-gray-900">{patient.emergencyContactPhone || "Not specified"}</p>
                            </div>
                        </div>
                    </section>

                    {/* Visit History */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-indigo-600" />
                            Visit History
                        </h3>
                        <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
                            <div>
                                <p className="text-xs text-indigo-700 uppercase tracking-wide mb-1">Last Visit</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(patient.lastVisit)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-indigo-700 uppercase tracking-wide mb-1">Member Since</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(patient.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-indigo-700 uppercase tracking-wide mb-1">Last Updated</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(patient.updatedAt)}</p>
                            </div>
                        </div>
                    </section>
                </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                        <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Edit Patient
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}
