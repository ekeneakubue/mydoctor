"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createMedicalRecord } from "@/app/actions/records.ts"; // Assumes you've created this action
import { Patient } from "@prisma/client";
import { Plus, X, Search, User } from "lucide-react";

interface CreateRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
}

const initialState = {
    message: null,
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "Creating..." : "Create Record"}
        </button>
    );
}

export function CreateRecordModal({ isOpen, onClose, patients }: CreateRecordModalProps) {
    const [state, formAction] = useActionState(createMedicalRecord, initialState);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");

    useEffect(() => {
        if (state?.message === "Medical record created successfully") {
            onClose();
            // Reset form could be handled here if needed, but managing full reset with useFormState can be tricky without external form ref
            setSelectedPatientId("");
            setSearchQuery("");
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    const filteredPatients = patients.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Plus className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    New Medical Record
                                </h3>

                                <form action={formAction} className="mt-5 space-y-4">
                                    {/* Patient Selection with Search */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search patient..."
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        {/* Dropdown list for selection */}
                                        <div className="mt-1 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-sm">
                                            {filteredPatients.length === 0 ? (
                                                <div className="p-2 text-sm text-gray-500 text-center">No patients found</div>
                                            ) : (
                                                filteredPatients.map(patient => (
                                                    <div
                                                        key={patient.id}
                                                        onClick={() => {
                                                            setSelectedPatientId(patient.id);
                                                            setSearchQuery(`${patient.firstName} ${patient.lastName}`);
                                                        }}
                                                        className={`flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer ${selectedPatientId === patient.id ? 'bg-blue-50 text-blue-700' : ''}`}
                                                    >
                                                        <User size={14} className="text-gray-400" />
                                                        <div className="text-sm">
                                                            <span className="font-medium">{patient.firstName} {patient.lastName}</span>
                                                            <span className="text-gray-500 ml-1 text-xs">({patient.email})</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <input type="hidden" name="patientId" value={selectedPatientId} />
                                        {state?.errors?.patientId && (
                                            <p className="mt-1 text-sm text-red-600">{state.errors.patientId}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            name="visitDate"
                                            id="visitDate"
                                            required
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                        />
                                        {state?.errors?.visitDate && (
                                            <p className="mt-2 text-sm text-red-600">{state.errors.visitDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
                                        <input
                                            type="text"
                                            name="diagnosis"
                                            id="diagnosis"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                            placeholder="e.g. Acute Bronchitis"
                                        />
                                        {state?.errors?.diagnosis && (
                                            <p className="mt-2 text-sm text-red-600">{state.errors.diagnosis}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">Treatment</label>
                                            <textarea
                                                name="treatment"
                                                id="treatment"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                                placeholder="Recommended treatment..."
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">Prescription</label>
                                            <textarea
                                                name="prescription"
                                                id="prescription"
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                                placeholder="Medications prescribed..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                            placeholder="Any other observations..."
                                        />
                                    </div>

                                    {state?.message && (
                                        <p className={`text-sm ${state.message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                                            {state.message}
                                        </p>
                                    )}

                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <SubmitButton />
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper needed locally if not exporting types from actions file
// Assuming createMedicalRecord returns the state shape
