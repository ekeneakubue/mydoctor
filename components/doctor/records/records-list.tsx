"use client";

import { useState } from "react";
import { MedicalRecord, Patient } from "@prisma/client";
import { format } from "date-fns";
import {
    Search,
    Filter,
    Plus,
    FileText,
    User,
    Calendar,
    Stethoscope, // For diagnosis/treatment icon
    Pill, // For prescription
    StickyNote // For notes
} from "lucide-react";
import { CreateRecordModal } from "./create-record-modal";

type MedicalRecordWithPatient = MedicalRecord & {
    patient: {
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: Date | null;
        gender: string | null;
    };
};

interface RecordsListProps {
    records: MedicalRecordWithPatient[];
    patients: Patient[];
}

export function RecordsList({ records, patients }: RecordsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredRecords = records.filter((record) => {
        const patientName = `${record.patient.firstName} ${record.patient.lastName}`.toLowerCase();
        const diagnosis = record.diagnosis.toLowerCase();
        const search = searchTerm.toLowerCase();

        return patientName.includes(search) || diagnosis.includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-500 mt-1">View and manage patient history and diagnoses</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>New Record</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient name or diagnosis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredRecords.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or create a new record.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Patient Info Column */}
                                    <div className="md:w-1/4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                {record.patient.firstName[0]}{record.patient.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-gray-900 font-semibold text-base">
                                                    {record.patient.firstName} {record.patient.lastName}
                                                </h3>
                                                <p className="text-gray-500 text-xs">{record.patient.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                            <Calendar size={14} />
                                            <span>Visit: {format(new Date(record.visitDate), "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <User size={14} />
                                            <span>
                                                {record.patient.gender || "N/A"}, {record.patient.dateOfBirth ?
                                                    `${new Date().getFullYear() - new Date(record.patient.dateOfBirth).getFullYear()} years` :
                                                    "Age N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Clinical Info Column */}
                                    <div className="flex-1 grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                                                    <Stethoscope size={16} className="text-blue-500" />
                                                    Diagnosis & Treatment
                                                </h4>
                                                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                                    <p className="text-gray-900 font-medium mb-1">{record.diagnosis}</p>
                                                    {record.treatment && (
                                                        <p className="text-sm text-gray-600">{record.treatment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {record.prescription && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                                                        <Pill size={16} className="text-green-500" />
                                                        Prescription
                                                    </h4>
                                                    <div className="bg-green-50/50 p-3 rounded-lg border border-green-100 text-sm text-gray-700">
                                                        {record.prescription}
                                                    </div>
                                                </div>
                                            )}

                                            {record.notes && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                                                        <StickyNote size={16} className="text-yellow-500" />
                                                        Notes
                                                    </h4>
                                                    <p className="text-sm text-gray-600 italic">
                                                        "{record.notes}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateRecordModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                patients={patients}
            />
        </div>
    );
}
