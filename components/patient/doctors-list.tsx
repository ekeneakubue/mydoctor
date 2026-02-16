"use client";

import { useState } from "react";
import { Doctor } from "@prisma/client";
import { Search, Filter, Stethoscope, MapPin, Star } from "lucide-react";
import { BookAppointmentModal } from "./book-appointment-modal";

interface DoctorsListProps {
    doctors: Doctor[];
    patientId: string;
}

export function DoctorsList({ doctors, patientId }: DoctorsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>("All");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // Get unique specializations
    const specializations = ["All", ...Array.from(new Set(doctors.map(d => d.specialization)))];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = selectedSpecialization === "All" || doctor.specialization === selectedSpecialization;

        return matchesSearch && matchesSpec;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Find a Doctor</h1>
                    <p className="mt-1 text-slate-500">Book an appointment with our specialists</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by doctor name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    >
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 shadow-inner">
                                    {doctor.firstName[0]}{doctor.lastName[0]}
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {doctor.isActive ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                                Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                <Stethoscope size={16} />
                                {doctor.specialization}
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {doctor.address || "Main Hospital"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    4.9 (120 reviews)
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 p-4">
                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={!doctor.isActive}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                    No doctors found matching your criteria.
                </div>
            )}

            {selectedDoctor && (
                <BookAppointmentModal
                    isOpen={!!selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                    doctor={selectedDoctor}
                    patientId={patientId}
                />
            )}
        </div>
    );
}
