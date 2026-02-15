import { prisma } from "@/lib/prisma";
import { DoctorsClient } from "@/components/admin/doctors-client";

export default async function DoctorsPage() {
    const doctors = await prisma.doctor.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return <DoctorsClient doctors={doctors} />;
}
