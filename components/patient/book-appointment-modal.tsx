"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import { createAppointment } from "@/app/actions/appointments";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Calendar as CalendarIcon, Stethoscope, X } from "lucide-react";
import { Doctor } from "@prisma/client";

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor;
    patientId: string;
}

// Define the state type to ensure type safety
interface FormState {
    message: string;
    errors: {
        date?: string[];
        time?: string[];
        reason?: string[];
        date_time?: string[]; // In case generic errors bubble up
    };
}

const initialState: FormState = {
    message: "",
    errors: {}
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "Scheduling..." : "Book Appointment"}
        </button>
    );
}

export function BookAppointmentModal({ isOpen, onClose, doctor, patientId }: BookAppointmentModalProps) {
    const [state, formAction] = useActionState(createAppointment, initialState);

    useEffect(() => {
        if (state.message === "Appointment created successfully") {
            onClose();
        }
    }, [state, onClose]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <CalendarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Book Appointment with Dr. {doctor.lastName}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Select a date and time for your consultation.
                                            </p>
                                        </div>

                                        <form action={formAction} className="mt-6 space-y-4">
                                            {/* Hidden Inputs */}
                                            <input type="hidden" name="patientId" value={patientId} />
                                            <input type="hidden" name="doctorId" value={doctor.id} />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                                        Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        id="date"
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                                                    />
                                                    {state?.errors?.date && (
                                                        <p className="mt-1 text-xs text-red-600">{state.errors.date}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                                        Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        name="time"
                                                        id="time"
                                                        required
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
                                                    />
                                                    {state?.errors?.time && (
                                                        <p className="mt-1 text-xs text-red-600">{state.errors.time}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                                    Reason for Visit
                                                </label>
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Stethoscope className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="reason"
                                                        id="reason"
                                                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2"
                                                        placeholder="e.g. Checkup, Consultation"
                                                    />
                                                </div>
                                                {state?.errors?.reason && (
                                                    <p className="mt-1 text-xs text-red-600">{state.errors.reason}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Additional Notes
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        rows={3}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                        placeholder="Any specific symptoms or questions?"
                                                    />
                                                </div>
                                            </div>

                                            {state?.message && (
                                                <div className={`p-3 rounded-md text-sm ${state.message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {state.message}
                                                </div>
                                            )}

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <SubmitButton />
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:mr-3 sm:text-sm"
                                                    onClick={onClose}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
