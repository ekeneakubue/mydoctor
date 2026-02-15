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
                    <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
                    <p className="text-gray-500 mt-1">Book an appointment with our specialists</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by doctor name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
                    <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
                                    {doctor.firstName[0]}{doctor.lastName[0]}
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {doctor.isActive ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mt-1">
                                <Stethoscope size={16} />
                                {doctor.specialization}
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-gray-500">
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

                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!doctor.isActive}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
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
