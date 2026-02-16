"use client";

import { Search, Plus, Filter, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Doctor } from "@prisma/client";
import { CreateDoctorModal } from "./create-doctor-modal";
import { EditDoctorModal } from "./edit-doctor-modal";
import { deleteDoctor } from "@/app/actions/doctor-actions";

interface DoctorsClientProps {
    doctors: Doctor[];
}

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function DoctorsClient({ doctors }: DoctorsClientProps) {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [deleteConfirmDoctor, setDeleteConfirmDoctor] = useState<Doctor | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState<string>("ALL");

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (doctor: Doctor) => {
        setDeleteConfirmDoctor(doctor);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmDoctor) return;

        setIsDeleting(true);
        const result = await deleteDoctor(deleteConfirmDoctor.id);
        setIsDeleting(false);

        if (result.success) {
            setDeleteConfirmDoctor(null);
            router.refresh();
        } else {
            alert(result.error || "Failed to delete doctor");
        }
    };

    const handleSuccess = () => {
        router.refresh();
    };

    // Get unique specializations
    const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

    // Filter doctors
    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecialty = specialtyFilter === "ALL" || doctor.specialization === specialtyFilter;
        
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Doctors</h1>
                    <p className="mt-1 text-slate-500">Manage your medical staff</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add Doctor
                </button>
            </div>

            <CreateDoctorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {selectedDoctor && (
                <EditDoctorModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedDoctor(null);
                    }}
                    doctor={selectedDoctor}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Delete Doctor</h2>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete <strong>Dr. {deleteConfirmDoctor.firstName} {deleteConfirmDoctor.lastName}</strong>? This will permanently remove the doctor from the system.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirmDoctor(null)}
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
                                        "Delete Doctor"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, specialty, or license..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                    />
                </div>
                <div className="flex gap-3">
                    <select 
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                    >
                        <option value="ALL">All Specialties</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-slate-500">
                                {searchTerm || specialtyFilter !== "ALL" 
                                    ? "No doctors found matching your search" 
                                    : "No doctors found"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {searchTerm || specialtyFilter !== "ALL"
                                    ? "Try adjusting your filters"
                                    : "Add your first doctor to get started"}
                            </p>
                        </div>
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                                    {getInitials(doctor.firstName, doctor.lastName)}
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    doctor.isActive 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                    {doctor.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="mb-4">
                                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-violet-700">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h3>
                                <p className="text-sm text-slate-500">{doctor.specialization}</p>
                                {doctor.department && (
                                    <p className="mt-1 text-xs text-slate-400">{doctor.department}</p>
                                )}
                            </div>

                            <div className="mb-4 space-y-2 text-sm text-slate-600">
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                                    <span className="text-xs font-medium uppercase text-slate-500">License</span>
                                    <span className="text-xs font-semibold text-slate-900">{doctor.licenseNumber}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                                    <span className="text-xs font-medium uppercase text-slate-500">Phone</span>
                                    <span className="text-xs font-semibold text-slate-900">{doctor.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => handleEdit(doctor)}
                                    className="rounded-lg bg-violet-50 px-3 py-2 text-center text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(doctor)}
                                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Results count */}
            {filteredDoctors.length > 0 && (
                <div className="text-center text-sm text-slate-500">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                </div>
            )}
        </div>
    );
}
