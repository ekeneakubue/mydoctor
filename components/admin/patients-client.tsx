"use client";

import { Search, Plus, Filter, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@prisma/client";
import { deletePatient } from "@/app/actions/patient-actions";
import { PatientDetailsPanel } from "./patient-details-panel";

interface PatientsClientProps {
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
    if (!date) return "Never";
    
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function PatientsClient({ patients }: PatientsClientProps) {
    const router = useRouter();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [deleteConfirmPatient, setDeleteConfirmPatient] = useState<Patient | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleViewRecords = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsPanelOpen(true);
    };

    const handleDeleteClick = (patient: Patient) => {
        setDeleteConfirmPatient(patient);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmPatient) return;

        setIsDeleting(true);
        const result = await deletePatient(deleteConfirmPatient.id);
        setIsDeleting(false);

        if (result.success) {
            setDeleteConfirmPatient(null);
            router.refresh();
        } else {
            alert(result.error || "Failed to delete patient");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Patients</h1>
                    <p className="mt-1 text-slate-500">Manage patient records and history</p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700">
                    <Plus size={18} />
                    New Patient
                </button>
            </div>

            {/* Patient Details Side Panel */}
            <PatientDetailsPanel
                isOpen={isPanelOpen}
                onClose={() => {
                    setIsPanelOpen(false);
                    setSelectedPatient(null);
                }}
                patient={selectedPatient}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirmPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Delete Patient</h2>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete <strong>{deleteConfirmPatient.firstName} {deleteConfirmPatient.lastName}</strong>? This will permanently remove the patient and all their medical records from the system.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirmPatient(null)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete Patient"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients by name, ID or phone..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Age</th>
                                <th className="px-6 py-4 font-semibold">Gender</th>
                                <th className="px-6 py-4 font-semibold">Phone</th>
                                <th className="px-6 py-4 font-semibold">Last Visit</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-sm text-slate-500">No patients found</p>
                                            <p className="text-xs text-slate-400">Add your first patient to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="group transition-colors hover:bg-slate-50">
                                        <td className="flex items-center gap-3 whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                                {getInitials(patient.firstName, patient.lastName)}
                                            </div>
                                            {patient.firstName} {patient.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{patient.gender ? patient.gender.toLowerCase() : "-"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{patient.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(patient.lastVisit)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                patient.isActive 
                                                    ? "bg-green-100 text-green-800 border-green-200" 
                                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                            }`}>
                                                {patient.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleViewRecords(patient)}
                                                    className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-800 hover:underline"
                                                >
                                                    View Records
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(patient)}
                                                    className="text-sm font-semibold text-red-600 transition-colors hover:text-red-800 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {patients.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
                        <span>Showing 1 to {patients.length} of {patients.length} patients</span>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 border border-gray-200 rounded-md hover:bg-white bg-white shadow-sm disabled:opacity-50 transition-all font-medium text-gray-700">Previous</button>
                            <button disabled className="px-3 py-1 border border-gray-200 rounded-md hover:bg-white bg-white shadow-sm disabled:opacity-50 transition-all font-medium text-gray-700">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
