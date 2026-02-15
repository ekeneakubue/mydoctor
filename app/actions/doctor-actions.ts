"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const doctorSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    specialization: z.string().min(1, "Specialization is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().min(1, "Address is required"),
    department: z.string().optional(),
    isActive: z.boolean().optional(),
})

export async function createDoctor(formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string
        const specialization = formData.get("specialization") as string
        const licenseNumber = formData.get("licenseNumber") as string
        const phone = formData.get("phone") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const address = formData.get("address") as string
        const department = formData.get("department") as string
        const isActive = formData.get("isActive") === "true"

        const validation = doctorSchema.safeParse({
            firstName,
            lastName,
            specialization,
            licenseNumber,
            phone,
            email,
            password,
            address,
            department,
            isActive,
        })

        if (!validation.success) {
            console.error("Validation error:", validation.error)
            return { 
                success: false, 
                error: validation.error.errors?.[0]?.message || "Invalid form data" 
            }
        }

        // Check if license number already exists
        const existingDoctor = await prisma.doctor.findUnique({
            where: { licenseNumber }
        })

        if (existingDoctor) {
            return { success: false, error: "License number already exists" }
        }

        // Check if email already exists
        const existingEmail = await prisma.doctor.findUnique({
            where: { email }
        })

        if (existingEmail) {
            return { success: false, error: "Email already in use" }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.doctor.create({
            data: {
                firstName,
                lastName,
                specialization,
                licenseNumber,
                phone,
                email,
                passwordHash,
                address,
                department: department || null,
                isActive: isActive !== undefined ? isActive : true,
            }
        })

        revalidatePath("/admin/doctors")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to create doctor:", error)
        return { 
            success: false, 
            error: error.message || "Failed to create doctor. Please try again." 
        }
    }
}

export async function updateDoctor(doctorId: string, formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string
        const specialization = formData.get("specialization") as string
        const licenseNumber = formData.get("licenseNumber") as string
        const phone = formData.get("phone") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const address = formData.get("address") as string
        const department = formData.get("department") as string
        const isActive = formData.get("isActive") === "true"

        // For update, password is optional
        const updateDoctorSchema = z.object({
            firstName: z.string().min(1, "First name is required"),
            lastName: z.string().min(1, "Last name is required"),
            specialization: z.string().min(1, "Specialization is required"),
            licenseNumber: z.string().min(1, "License number is required"),
            phone: z.string().min(1, "Phone is required"),
            email: z.string().email("Invalid email"),
            password: z.union([
                z.string().min(6, "Password must be at least 6 characters"),
                z.string().length(0)
            ]).optional(),
            address: z.string().min(1, "Address is required"),
            department: z.string().optional(),
            isActive: z.boolean().optional(),
        })

        const validation = updateDoctorSchema.safeParse({
            firstName,
            lastName,
            specialization,
            licenseNumber,
            phone,
            email,
            password: password || undefined,
            address,
            department,
            isActive,
        })

        if (!validation.success) {
            console.error("Validation error:", validation.error)
            return { 
                success: false, 
                error: validation.error.errors?.[0]?.message || "Invalid form data" 
            }
        }

        // Check if license number is being changed and if it's already taken
        const existingLicense = await prisma.doctor.findUnique({
            where: { licenseNumber }
        })
        if (existingLicense && existingLicense.id !== doctorId) {
            return { success: false, error: "License number already in use by another doctor" }
        }

        // Check if email is being changed and if it's already taken
        const existingEmail = await prisma.doctor.findUnique({
            where: { email }
        })
        if (existingEmail && existingEmail.id !== doctorId) {
            return { success: false, error: "Email already in use by another doctor" }
        }

        // Prepare update data
        const updateData: any = {
            firstName,
            lastName,
            specialization,
            licenseNumber,
            phone,
            email,
            address,
            department: department || null,
            isActive,
        }

        // Only update password if provided
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10)
        }

        await prisma.doctor.update({
            where: { id: doctorId },
            data: updateData
        })

        revalidatePath("/admin/doctors")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to update doctor:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "License number or email already in use" }
        }
        if (error.code === 'P2025') {
            return { success: false, error: "Doctor not found" }
        }
        return { 
            success: false, 
            error: error.message || "Failed to update doctor. Please try again." 
        }
    }
}

export async function deleteDoctor(doctorId: string) {
    try {
        await prisma.doctor.delete({
            where: { id: doctorId }
        })

        revalidatePath("/admin/doctors")
        return { success: true }
    } catch (error: any) {
        console.error("Failed to delete doctor:", error)
        return { 
            success: false, 
            error: error.message || "Failed to delete doctor. Please try again." 
        }
    }
}
