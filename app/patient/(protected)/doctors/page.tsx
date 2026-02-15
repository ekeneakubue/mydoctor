import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { DoctorsList } from "@/components/patient/doctors-list";

export default async function DoctorsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const doctors = await prisma.doctor.findMany({
        orderBy: {
            lastName: 'asc'
        }
    });

    return <DoctorsList doctors={doctors} patientId={user.id} />;
}
