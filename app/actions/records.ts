"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

const createRecordSchema = z.object({
    patientId: z.string().uuid(),
    diagnosis: z.string().min(1, "Diagnosis is required"),
    prescription: z.string().optional(),
    treatment: z.string().optional(),
    notes: z.string().optional(),
    visitDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date",
    }),
});

export async function createMedicalRecord(prevState: any, formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        return { message: "Unauthorized", errors: {} };
    }

    // Verify doctor role/existence
    const doctor = await prisma.doctor.findUnique({
        where: { id: user.id }
    });

    if (!doctor) {
        return { message: "Unauthorized: Only doctors can create records", errors: {} };
    }

    const validatedFields = createRecordSchema.safeParse({
        patientId: formData.get("patientId"),
        diagnosis: formData.get("diagnosis"),
        prescription: formData.get("prescription"),
        treatment: formData.get("treatment"),
        notes: formData.get("notes"),
        visitDate: formData.get("visitDate"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Record.",
        };
    }

    const { patientId, diagnosis, prescription, treatment, notes, visitDate } = validatedFields.data;

    try {
        await prisma.medicalRecord.create({
            data: {
                patientId,
                doctorId: doctor.id,
                diagnosis,
                prescription,
                treatment,
                notes,
                visitDate: new Date(visitDate),
            },
        });

        revalidatePath("/doctor/records");
        return { message: "Medical record created successfully" };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to Create Record.",
        };
    }
}
