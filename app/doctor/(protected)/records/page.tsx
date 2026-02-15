import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { RecordsList } from "@/components/doctor/records/records-list";

export default async function MedicalRecordsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/doctor/login");
    }

    const [records, patients] = await Promise.all([
        prisma.medicalRecord.findMany({
            where: {
                doctorId: user.id
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        dateOfBirth: true,
                        gender: true
                    }
                }
            },
            orderBy: {
                visitDate: 'desc'
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

    // Transform dateOfBirth to match the type expected by RecordsList (Date | null)
    // Prisma returns Date | null, which matches, but let's be explicit if needed
    // The type definition in RecordsList expects Date | null, so it should be compatible directly.

    return <RecordsList records={records as any} patients={patients} />;
}
