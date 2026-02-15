import { prisma } from "@/lib/prisma";
import { ScheduleCalendar } from "@/components/doctor/schedule/calendar";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function DoctorSchedulePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/doctor/login");
    }

    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId: user.id
        },
        include: {
            patient: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        orderBy: {
            appointmentDate: 'asc'
        }
    });

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule</h1>
            <ScheduleCalendar appointments={appointments as any} />
        </div>
    );
}
