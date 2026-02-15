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
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-500 mt-1">Manage patient records and history</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients by name, ID or phone..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-medium tracking-wider">
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
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-gray-500 text-sm">No patients found</p>
                                            <p className="text-gray-400 text-xs">Add your first patient to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3 whitespace-nowrap">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                {getInitials(patient.firstName, patient.lastName)}
                                            </div>
                                            {patient.firstName} {patient.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : "-"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{patient.gender ? patient.gender.toLowerCase() : "-"}</td>
                                        <td className="px-6 py-4 text-gray-900 whitespace-nowrap font-medium">{patient.phone}</td>
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
                                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm transition-colors"
                                                >
                                                    View Records
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(patient)}
                                                    className="text-red-600 hover:text-red-800 font-medium hover:underline text-sm transition-colors"
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
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
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
