"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createAppointmentSchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid().optional(),
    date: z.string(),
    time: z.string(),
    reason: z.string().optional(),
    notes: z.string().optional(),
});

interface AppointmentFormState {
    message: string;
    errors?: {
        patientId?: string[];
        doctorId?: string[];
        date?: string[];
        time?: string[];
        reason?: string[];
        notes?: string[];
    };
}

export async function createAppointment(prevState: AppointmentFormState, formData: FormData) {
    void prevState;
    const user = await getCurrentUser();

    if (!user) {
        return { message: "Unauthorized", errors: {} };
    }

    // Check if user is a doctor
    const doctor = await prisma.doctor.findUnique({
        where: { id: user.id }
    });

    // Check if user is a patient
    const patient = !doctor ? await prisma.patient.findUnique({
        where: { id: user.id }
    }) : null;

    if (!doctor && !patient) {
        return { message: "Unauthorized: User not found", errors: {} };
    }

    const validatedFields = createAppointmentSchema.safeParse({
        patientId: formData.get("patientId"), // If doctor, this is from form. If patient, this is effectively ignored here but validated.
        doctorId: formData.get("doctorId"),
        date: formData.get("date"),
        time: formData.get("time"),
        reason: formData.get("reason"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Appointment.",
        };
    }

    const { date, time, reason, notes } = validatedFields.data;
    let patientId = validatedFields.data.patientId;
    let doctorId = validatedFields.data.doctorId;

    // Logic:
    // If Doctor: doctorId comes from user.id, patientId comes from form.
    // If Patient: patientId comes from user.id, doctorId comes from form.

    if (doctor) {
        doctorId = doctor.id;
        // patientId is already correct from form
    } else if (patient) {
        patientId = patient.id;
        // doctorId must be from form
        if (!doctorId) {
            return { message: "Doctor ID is required for patient booking", errors: {} };
        }
    }

    // Combine date and time into a single DateTime string
    const appointmentDateTime = new Date(`${date}T${time}:00`);

    try {
        await prisma.appointment.create({
            data: {
                patientId,
                doctorId: doctorId!, // Non-null assertion safe because of checks above
                appointmentDate: appointmentDateTime,
                reason,
                notes,
                status: 'SCHEDULED',
            },
        });

        // Revalidate both paths to be safe
        revalidatePath("/doctor/appointments");
        revalidatePath("/patient/appointments");

        return { message: "Appointment created successfully" };
    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to Create Appointment.",
        };
    }
}
