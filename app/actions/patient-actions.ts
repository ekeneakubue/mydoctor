"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message
    return fallback
}

export async function deletePatient(patientId: string) {
    try {
        await prisma.patient.delete({
            where: { id: patientId }
        })

        revalidatePath("/admin/patients")
        return { success: true }
    } catch (error: unknown) {
        console.error("Failed to delete patient:", error)
        return { 
            success: false, 
            error: getErrorMessage(error, "Failed to delete patient. Please try again.") 
        }
    }
}
