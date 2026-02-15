import { prisma } from "@/lib/prisma";
import { PatientsListClient } from "@/components/doctor/patients-list-client";

export default async function DoctorPatientsPage() {
    const patients = await prisma.patient.findMany({
        where: {
            isActive: true // Only show active patients
        },
        orderBy: {
            lastName: "asc"
        }
    });

    return <PatientsListClient patients={patients} />;
}
