"use client";

import { Search, User, Phone, Mail, Calendar, Heart, AlertCircle, X, MapPin, Shield } from "lucide-react";
import { useState } from "react";
import { Patient } from "@prisma/client";

interface PatientsListClientProps {
    patients: Patient[];
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

export function PatientsListClient({ patients }: PatientsListClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [genderFilter, setGenderFilter] = useState<string>("ALL");

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsPanelOpen(true);
    };

    // Filter patients
    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGender = genderFilter === "ALL" || patient.gender === genderFilter;

        return matchesSearch && matchesGender;
    });

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">My Patients</h1>
                        <p className="mt-1 text-slate-500">View and manage your patient records</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-600">
                            {filteredPatients.length} Patients
                        </span>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="ALL">All Genders</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Patients Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPatients.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
                            <div className="flex flex-col items-center gap-3">
                                <User className="text-slate-300" size={48} />
                                <p className="text-sm text-slate-500">
                                    {searchTerm || genderFilter !== "ALL"
                                        ? "No patients found matching your filters"
                                        : "No patients assigned yet"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => handleViewPatient(patient)}
                                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                            >
                                {/* Patient Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                                        {getInitials(patient.firstName, patient.lastName)}
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${patient.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {patient.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Patient Name */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                                        {patient.firstName} {patient.lastName}
                                    </h3>
                                    {patient.dateOfBirth && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            {calculateAge(patient.dateOfBirth)} years old
                                            {patient.gender && ` • ${patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase()}`}
                                        </p>
                                    )}
                                </div>

                                {/* Patient Info */}
                                <div className="space-y-2 mb-4">
                                    {patient.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail size={14} className="text-slate-400" />
                                            <span className="truncate">{patient.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone size={14} className="text-slate-400" />
                                        <span>{patient.phone}</span>
                                    </div>
                                    {patient.lastVisit && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Info Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {patient.bloodType && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium">
                                            <Heart size={12} />
                                            {patient.bloodType}
                                        </span>
                                    )}
                                    {patient.allergies && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                                            <AlertCircle size={12} />
                                            Allergies
                                        </span>
                                    )}
                                </div>

                                {/* View Button */}
                                <button className="mt-4 w-full rounded-lg bg-blue-50 py-2 text-sm font-semibold text-blue-700 transition-colors group-hover:bg-blue-100">
                                    View Full Record
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Patient Details Panel */}
            {isPanelOpen && selectedPatient && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                        onClick={() => {
                            setIsPanelOpen(false);
                            setSelectedPatient(null);
                        }}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className="w-full max-w-[50%] min-w-[600px] max-h-[90vh] bg-white shadow-2xl rounded-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300 overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg z-10 rounded-t-2xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                                            {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {selectedPatient.firstName} {selectedPatient.lastName}
                                            </h2>
                                            <p className="text-blue-100 text-sm mt-1">
                                                Patient ID: {selectedPatient.id.substring(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsPanelOpen(false);
                                            setSelectedPatient(null);
                                        }}
                                        className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">{selectedPatient.dateOfBirth ? calculateAge(selectedPatient.dateOfBirth) : "-"}</div>
                                        <div className="text-xs text-blue-100">Years Old</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">{selectedPatient.bloodType || "-"}</div>
                                        <div className="text-xs text-blue-100">Blood Type</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                        <div className="text-xs text-blue-100 mb-1">Gender</div>
                                        <div className="text-sm font-bold">{selectedPatient.gender || "-"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Contact Information */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <User size={20} className="text-blue-600" />
                                        Contact Information
                                    </h3>
                                    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                                        {selectedPatient.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-blue-600" />
                                                <div>
                                                    <p className="text-xs text-blue-700 font-medium">Email</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <Phone size={16} className="text-blue-600" />
                                            <div>
                                                <p className="text-xs text-blue-700 font-medium">Phone</p>
                                                <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                                            </div>
                                        </div>
                                        {selectedPatient.address && (
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-blue-600 mt-1" />
                                                <div>
                                                    <p className="text-xs text-blue-700 font-medium">Address</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Medical Information */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Heart size={20} className="text-red-600" />
                                        Medical Information
                                    </h3>
                                    <div className="bg-red-50 rounded-xl p-4 space-y-4">
                                        <div>
                                            <p className="text-xs text-red-700 font-medium mb-1">Blood Type</p>
                                            <p className="text-sm text-gray-900">{selectedPatient.bloodType || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-red-700 font-medium mb-1">Allergies</p>
                                            <p className="text-sm text-gray-900">{selectedPatient.allergies || "None reported"}</p>
                                        </div>
                                        {selectedPatient.medicalHistory && (
                                            <div>
                                                <p className="text-xs text-red-700 font-medium mb-1">Medical History</p>
                                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedPatient.medicalHistory}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Insurance */}
                                {(selectedPatient.insuranceProvider || selectedPatient.insuranceNumber) && (
                                    <section>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Shield size={20} className="text-green-600" />
                                            Insurance
                                        </h3>
                                        <div className="bg-green-50 rounded-xl p-4 space-y-3">
                                            {selectedPatient.insuranceProvider && (
                                                <div>
                                                    <p className="text-xs text-green-700 font-medium mb-1">Provider</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.insuranceProvider}</p>
                                                </div>
                                            )}
                                            {selectedPatient.insuranceNumber && (
                                                <div>
                                                    <p className="text-xs text-green-700 font-medium mb-1">Policy Number</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.insuranceNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Emergency Contact */}
                                {(selectedPatient.emergencyContactName || selectedPatient.emergencyContactPhone) && (
                                    <section>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <AlertCircle size={20} className="text-orange-600" />
                                            Emergency Contact
                                        </h3>
                                        <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                                            {selectedPatient.emergencyContactName && (
                                                <div>
                                                    <p className="text-xs text-orange-700 font-medium mb-1">Name</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.emergencyContactName}</p>
                                                </div>
                                            )}
                                            {selectedPatient.emergencyContactPhone && (
                                                <div>
                                                    <p className="text-xs text-orange-700 font-medium mb-1">Phone</p>
                                                    <p className="text-sm text-gray-900">{selectedPatient.emergencyContactPhone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Visit History */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar size={20} className="text-indigo-600" />
                                        Visit History
                                    </h3>
                                    <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
                                        <div>
                                            <p className="text-xs text-indigo-700 font-medium mb-1">Last Visit</p>
                                            <p className="text-sm text-gray-900">{formatDate(selectedPatient.lastVisit)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-700 font-medium mb-1">Registered</p>
                                            <p className="text-sm text-gray-900">{formatDate(selectedPatient.createdAt)}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setIsPanelOpen(false);
                                            setSelectedPatient(null);
                                        }}
                                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                        Schedule Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
