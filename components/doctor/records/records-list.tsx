"use client";

import { useState } from "react";
import { MedicalRecord, Patient } from "@prisma/client";
import { format } from "date-fns";
import {
    Search,
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
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Medical Records</h1>
                    <p className="mt-1 text-slate-500">View and manage patient history and diagnoses</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>New Record</span>
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient name or diagnosis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {filteredRecords.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="mx-auto mb-3 text-slate-300" size={48} />
                        <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
                        <p className="mt-1 text-slate-500">Try adjusting your search or create a new record.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="p-6 transition-colors hover:bg-slate-50">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Patient Info Column */}
                                    <div className="md:w-1/4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {record.patient.firstName[0]}{record.patient.lastName[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-900">
                                                    {record.patient.firstName} {record.patient.lastName}
                                                </h3>
                                                <p className="text-xs text-slate-500">{record.patient.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={14} />
                                            <span>Visit: {format(new Date(record.visitDate), "MMM d, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
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
                                                <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                    <Stethoscope size={16} className="text-blue-500" />
                                                    Diagnosis & Treatment
                                                </h4>
                                                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                                                    <p className="mb-1 font-semibold text-slate-900">{record.diagnosis}</p>
                                                    {record.treatment && (
                                                        <p className="text-sm text-slate-600">{record.treatment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {record.prescription && (
                                                <div>
                                                    <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <Pill size={16} className="text-green-500" />
                                                        Prescription
                                                    </h4>
                                                    <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 text-sm text-slate-700">
                                                        {record.prescription}
                                                    </div>
                                                </div>
                                            )}

                                            {record.notes && (
                                                <div>
                                                    <h4 className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <StickyNote size={16} className="text-yellow-500" />
                                                        Notes
                                                    </h4>
                                                    <p className="text-sm italic text-slate-600">
                                                        &quot;{record.notes}&quot;
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
