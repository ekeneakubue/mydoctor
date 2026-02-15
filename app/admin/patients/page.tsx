import { prisma } from "@/lib/prisma";
import { PatientsClient } from "@/components/admin/patients-client";

export default async function PatientsPage() {
    const patients = await prisma.patient.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return <PatientsClient patients={patients} />;
}
