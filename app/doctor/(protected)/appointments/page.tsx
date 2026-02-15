import { prisma } from "@/lib/prisma";
import { AppointmentsList } from "@/components/doctor/appointments/appointments-list";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function DoctorAppointmentsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/doctor/login");
    }

    const [appointments, patients] = await Promise.all([
        prisma.appointment.findMany({
            where: {
                doctorId: user.id
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                appointmentDate: 'asc'
            }
        }),
        prisma.patient.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                lastName: 'asc'
            }
        })
    ]);

    return <AppointmentsList appointments={appointments} patients={patients} />;
}
