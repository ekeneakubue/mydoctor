"use client";

import { useState } from "react";
import { Appointment } from "@prisma/client";
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    addWeeks,
    subWeeks,
    isToday,
    startOfMonth,
    endOfMonth,
    eachHourOfInterval,
    setHours,
    setMinutes,
    addMonths,
    subMonths
} from "date-fns";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";

type ViewType = "day" | "week" | "month";

interface ScheduleCalendarProps {
    appointments: (Appointment & {
        patient: {
            firstName: string;
            lastName: string;
        }
    })[];
}

export function ScheduleCalendar({ appointments }: ScheduleCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewType>("week");

    // Navigation handlers
    const nextPeriod = () => {
        if (view === "day") setCurrentDate(d => new Date(d.setDate(d.getDate() + 1)));
        if (view === "week") setCurrentDate(d => addWeeks(d, 1));
        if (view === "month") setCurrentDate(d => addMonths(d, 1));
    };

    const prevPeriod = () => {
        if (view === "day") setCurrentDate(d => new Date(d.setDate(d.getDate() - 1)));
        if (view === "week") setCurrentDate(d => subWeeks(d, 1));
        if (view === "month") setCurrentDate(d => subMonths(d, 1));
    };

    const jumpToToday = () => setCurrentDate(new Date());

    // Data generation for views
    const renderHeader = () => {
        const dateFormat = view === "month" ? "MMMM yyyy" : "MMMM d, yyyy";

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {view === "week" ? (
                            <>
                                {format(startOfWeek(currentDate), "MMM d")} - {format(endOfWeek(currentDate), "MMM d, yyyy")}
                            </>
                        ) : (
                            format(currentDate, dateFormat)
                        )}
                    </h2>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={prevPeriod} className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={jumpToToday} className="px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                            Today
                        </button>
                        <button onClick={nextPeriod} className="p-2 hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(["day", "week", "month"] as ViewType[]).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${view === v
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weeks: Date[][] = [];
        let daysInWeek: Date[] = [];

        days.forEach((day, i) => {
            if (i % 7 === 0 && i !== 0) {
                weeks.push(daysInWeek);
                daysInWeek = [];
            }
            daysInWeek.push(day);
        });
        weeks.push(daysInWeek);

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="divide-y divide-gray-200">
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="grid grid-cols-7 divide-x divide-gray-200 min-h-[120px]">
                            {week.map((day, dayIdx) => {
                                const dayAppointments = appointments.filter(apt =>
                                    isSameDay(new Date(apt.appointmentDate), day)
                                );
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth();

                                return (
                                    <div
                                        key={dayIdx}
                                        className={`p-2 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? "bg-gray-50/50" : ""}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span
                                                className={`
                                                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                                    ${isToday(day)
                                                        ? "bg-blue-600 text-white"
                                                        : isCurrentMonth ? "text-gray-700" : "text-gray-400"
                                                    }
                                                `}
                                            >
                                                {format(day, "d")}
                                            </span>
                                            {dayAppointments.length > 0 && (
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                    {dayAppointments.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            {dayAppointments.slice(0, 3).map((apt) => (
                                                <div
                                                    key={apt.id}
                                                    className={`
                                                        text-xs p-1.5 rounded border border-l-2 truncate cursor-pointer
                                                        ${apt.status === "SCHEDULED" ? "bg-blue-50 border-blue-200 border-l-blue-500 text-blue-700" :
                                                            apt.status === "COMPLETED" ? "bg-green-50 border-green-200 border-l-green-500 text-green-700" :
                                                                "bg-gray-50 border-gray-200 border-l-gray-400 text-gray-600"}
                                                    `}
                                                >
                                                    {format(new Date(apt.appointmentDate), "HH:mm")} • {apt.patient.firstName}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 3 && (
                                                <div className="text-xs text-gray-500 text-center py-1 font-medium hover:text-blue-600 cursor-pointer">
                                                    + {dayAppointments.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const hours = eachHourOfInterval({
            start: setHours(setMinutes(new Date(), 0), 8), // 8 AM
            end: setHours(setMinutes(new Date(), 0), 18)  // 6 PM
        });

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                {/* Header Row */}
                <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 flex-none">
                    <div className="p-4 text-center text-sm font-semibold text-gray-500 border-r border-gray-200">
                        Time
                    </div>
                    {days.map((day) => (
                        <div key={day.toString()} className="py-3 text-center border-r border-gray-200 last:border-r-0">
                            <div className={`text-xs uppercase font-semibold ${isToday(day) ? "text-blue-600" : "text-gray-500"}`}>
                                {format(day, "EEE")}
                            </div>
                            <div className={`text-xl font-bold mt-1 ${isToday(day)
                                ? "bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm"
                                : "text-gray-900"
                                }`}>
                                {format(day, "d")}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Time Grid */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="grid grid-cols-8">
                        {/* Time Column */}
                        <div className="border-r border-gray-200">
                            {hours.map((hour) => (
                                <div key={hour.toString()} className="h-20 border-b border-gray-100 flex items-start justify-center pt-2 text-xs font-medium text-gray-500 relative">
                                    <span className="-mt-3 bg-white px-1">
                                        {format(hour, "h a")}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {days.map((day) => (
                            <div key={day.toString()} className="border-r border-gray-200 last:border-r-0 relative">
                                {hours.map((hour) => (
                                    <div key={hour.toString()} className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors" />
                                ))}

                                {/* Appointments Overlay */}
                                {appointments
                                    .filter(apt => isSameDay(new Date(apt.appointmentDate), day))
                                    .map(apt => {
                                        const aptDate = new Date(apt.appointmentDate);
                                        const startHour = aptDate.getHours();
                                        const startMinute = aptDate.getMinutes();

                                        // Calculate position: (hour - 8) * 80px + (minute / 60) * 80px
                                        // Assuming 8 AM start and 80px row height
                                        const top = ((startHour - 8) * 80) + ((startMinute / 60) * 80);

                                        // Skip if outside view hours (8 AM - 6 PM)
                                        if (startHour < 8 || startHour > 18) return null;

                                        return (
                                            <div
                                                key={apt.id}
                                                style={{ top: `${top}px` }}
                                                className={`
                                                    absolute left-1 right-1 p-2 rounded-md border-l-4 shadow-sm text-xs cursor-pointer hover:shadow-md transition-all z-10
                                                    ${apt.status === "SCHEDULED" ? "bg-blue-50 border-blue-500 text-blue-700" :
                                                        apt.status === "COMPLETED" ? "bg-green-50 border-green-500 text-green-700" :
                                                            "bg-gray-50 border-gray-400 text-gray-700"}
                                                `}
                                            >
                                                <div className="font-semibold flex items-center justify-between">
                                                    <span>{format(aptDate, "h:mm a")}</span>
                                                    {isToday(day) && apt.status === "SCHEDULED" && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                                </div>
                                                <div className="mt-0.5 font-medium truncate">
                                                    {apt.patient.firstName} {apt.patient.lastName}
                                                </div>
                                                {apt.reason && (
                                                    <div className="mt-0.5 text-xs opacity-80 truncate">
                                                        {apt.reason}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const hours = eachHourOfInterval({
            start: setHours(setMinutes(new Date(), 0), 8), // 8 AM
            end: setHours(setMinutes(new Date(), 0), 18)  // 6 PM
        });

        // Current Date's appointments
        const todaysAppointments = appointments.filter(apt =>
            isSameDay(new Date(apt.appointmentDate), currentDate)
        );

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                {/* Header Row */}
                <div className="border-b border-gray-200 bg-gray-50 flex-none py-3 text-center">
                    <div className={`text-xs uppercase font-semibold ${isToday(currentDate) ? "text-blue-600" : "text-gray-500"}`}>
                        {format(currentDate, "EEEE")}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${isToday(currentDate)
                            ? "bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm"
                            : "text-gray-900"
                        }`}>
                        {format(currentDate, "d")}
                    </div>
                </div>

                {/* Time Grid */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 relative">
                    <div className="grid grid-cols-[80px_1fr]">
                        {/* Time Column */}
                        <div className="border-r border-gray-200">
                            {hours.map((hour) => (
                                <div key={hour.toString()} className="h-20 border-b border-gray-100 flex items-start justify-center pt-2 text-xs font-medium text-gray-500 relative">
                                    <span className="-mt-3 bg-white px-1">
                                        {format(hour, "h a")}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Schedule Column */}
                        <div className="relative">
                            {hours.map((hour) => (
                                <div key={hour.toString()} className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors" />
                            ))}

                            {/* Appointments Overlay */}
                            {todaysAppointments.map(apt => {
                                const aptDate = new Date(apt.appointmentDate);
                                const startHour = aptDate.getHours();
                                const startMinute = aptDate.getMinutes();

                                // Calculate position: (hour - 8) * 80px + (minute / 60) * 80px
                                // Assuming 8 AM start and 80px row height
                                const top = ((startHour - 8) * 80) + ((startMinute / 60) * 80);

                                // Skip if outside view hours (8 AM - 6 PM)
                                if (startHour < 8 || startHour > 18) return null;

                                return (
                                    <div
                                        key={apt.id}
                                        style={{ top: `${top}px` }}
                                        className={`
                                            absolute left-4 right-4 p-3 rounded-md border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all z-10
                                            ${apt.status === "SCHEDULED" ? "bg-blue-50 border-blue-500 text-blue-700" :
                                                apt.status === "COMPLETED" ? "bg-green-50 border-green-500 text-green-700" :
                                                    "bg-gray-50 border-gray-400 text-gray-700"}
                                        `}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-bold text-lg flex items-center gap-2">
                                                    {format(aptDate, "h:mm a")}
                                                    {isToday(currentDate) && apt.status === "SCHEDULED" && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                                </div>
                                                <div className="font-semibold text-base mt-1">
                                                    {apt.patient.firstName} {apt.patient.lastName}
                                                </div>
                                                {apt.reason && (
                                                    <div className="mt-1 text-sm opacity-90 flex items-center gap-1">
                                                        <span className="font-medium">Reason:</span> {apt.reason}
                                                    </div>
                                                )}
                                                {apt.notes && (
                                                    <div className="mt-1 text-sm opacity-80 italic">
                                                        &quot;{apt.notes}&quot;
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide border ${apt.status === "SCHEDULED" ? "border-blue-200 bg-blue-100" :
                                                        apt.status === "COMPLETED" ? "border-green-200 bg-green-100" :
                                                            "border-gray-200 bg-gray-100"
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {renderHeader()}
            {view === "month" ? renderMonthView() :
                view === "week" ? renderWeekView() :
                    renderDayView()}
        </div>
    );
}
