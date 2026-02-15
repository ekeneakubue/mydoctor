"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deletePatient(patientId: string) {
    try {
        await prisma.patient.delete({
            where: { id: patientId }
        })

        revalidatePath("/admin/patients")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete patient:", error)
        return { 
            success: false, 
            error: error.message || "Failed to delete patient. Please try again." 
        }
    }
}
