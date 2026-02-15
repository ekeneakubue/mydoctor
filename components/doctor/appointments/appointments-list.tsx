"use client";

import { useState } from "react";
import { Appointment, Patient, AppointmentStatus } from "@prisma/client";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    FileText,
    MoreVertical,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    Plus
} from "lucide-react";
import { format } from "date-fns";
import { CreateAppointmentModal } from "./create-modal";

type AppointmentWithPatient = Appointment & {
    patient: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }
};

interface AppointmentsListProps {
    appointments: AppointmentWithPatient[];
    patients: Patient[];
}

export function AppointmentsList({ appointments, patients }: AppointmentsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>("ALL");
    const [dateFilter, setDateFilter] = useState<string>("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || appointment.status === statusFilter;

        const matchesDate = !dateFilter ||
            format(new Date(appointment.appointmentDate), 'yyyy-MM-dd') === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case "SCHEDULED": return "bg-blue-100 text-blue-700";
            case "COMPLETED": return "bg-green-100 text-green-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            case "NO_SHOW": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your schedule and patient visits</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>New Appointment</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients or reasons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                        </select>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredAppointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <CalendarIcon className="mx-auto text-gray-300 mb-3" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or create a new appointment</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredAppointments.map((appointment) => (
                            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Time & Date */}
                                    <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-1 w-48 shrink-0">
                                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                            <Clock size={20} className="text-blue-600" />
                                            {format(new Date(appointment.appointmentDate), 'h:mm a')}
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">
                                            {format(new Date(appointment.appointmentDate), 'EEEE, MMM d, yyyy')}
                                        </div>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 group cursor-pointer hover:text-blue-600 transition-colors">
                                                    {appointment.patient.firstName} {appointment.patient.lastName}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <FileText size={14} />
                                                        {appointment.reason || "General Checkup"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>

                                        {appointment.notes && (
                                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <span className="font-medium text-gray-700">Notes: </span>
                                                {appointment.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 lg:flex-col xl:flex-row">
                                        {appointment.status === 'SCHEDULED' && (
                                            <>
                                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip" title="Mark Complete">
                                                    <CheckCircle2 size={20} />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Cancel">
                                                    <XCircle size={20} />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateAppointmentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                patients={patients}
            />
        </div>
    );
}
