"use client";

import { useFormStatus } from "react-dom";
import { createAppointment } from "@/app/actions/appointments";
import { useEffect, useActionState } from "react";
import { Calendar as CalendarIcon, Clock, User, FileText } from "lucide-react";
import { Patient } from "@prisma/client";

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
}

const initialState = {
    message: "",
    errors: {}
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                </>
            ) : (
                "Create Appointment"
            )}
        </button>
    );
}

export function CreateAppointmentModal({ isOpen, onClose, patients }: CreateAppointmentModalProps) {
    const [state, formAction] = useActionState(createAppointment, initialState);

    // Reset form state when modal closes or opens
    useEffect(() => {
        if (!isOpen) {
            // Reset logic if needed
        }
    }, [isOpen]);

    // Close modal on successful submission
    useEffect(() => {
        if (state.message === "Appointment created successfully") {
            onClose();
        }
    }, [state.message, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <CalendarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    New Appointment
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Fill in the details below to schedule a new appointment.
                                    </p>
                                </div>

                                <form action={formAction} className="mt-5 space-y-4">
                                    {/* Patient Selection */}
                                    <div>
                                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                                            Patient
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <select
                                                id="patientId"
                                                name="patientId"
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                                required
                                            >
                                                <option value="">Select a patient</option>
                                                {patients.map((patient) => (
                                                    <option key={patient.id} value={patient.id}>
                                                        {patient.firstName} {patient.lastName} ({patient.email || "No email"})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {state?.errors?.patientId && (
                                            <p className="mt-2 text-sm text-red-600" id="email-error">
                                                {state.errors.patientId}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                                Date
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                                Time
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Clock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="time"
                                                    name="time"
                                                    id="time"
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {state?.errors?.date && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {state.errors.date}
                                        </p>
                                    )}

                                    {/* Reason */}
                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                            Reason for Visit
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                name="reason"
                                                id="reason"
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                                                placeholder="e.g. Annual checkup, Flu symptoms"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes (Optional)
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows={3}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                                                placeholder="Add any additional details here..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    {state?.message && (
                                        <div className={`rounded-md p-4 ${state.message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                            <p className="text-sm font-medium">{state.message}</p>
                                        </div>
                                    )}

                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <SubmitButton />
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:mr-3 sm:text-sm"
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
