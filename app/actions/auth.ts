"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"
import { cookies } from "next/headers"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
})

export async function login(formData: FormData) {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const validation = loginSchema.safeParse({ email, password })

        if (!validation.success) {
            return { 
                success: false, 
                error: validation.error.errors?.[0]?.message || "Invalid form data"
            }
        }

        // First, try to find in User table (for ADMIN/STAFF)
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user) {
            // Verify password for user
            const passwordMatch = await bcrypt.compare(password, user.passwordHash)

            if (!passwordMatch) {
                return { 
                    success: false, 
                    error: "Invalid email or password" 
                }
            }

            // Create session for user
            const cookieStore = await cookies()
            cookieStore.set("user_id", user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_role", user.role, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_email", user.email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_type", "user", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            return { success: true, role: user.role, userType: "user" }
        }

        // Try Doctor table
        const doctor = await prisma.doctor.findUnique({
            where: { email }
        })

        if (doctor) {
            // Verify password for doctor
            const passwordMatch = await bcrypt.compare(password, doctor.passwordHash)

            if (!passwordMatch) {
                return { 
                    success: false, 
                    error: "Invalid email or password" 
                }
            }

            // Create session for doctor
            const cookieStore = await cookies()
            cookieStore.set("user_id", doctor.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_role", "DOCTOR", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_email", doctor.email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            cookieStore.set("user_type", "doctor", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            return { success: true, role: "DOCTOR", userType: "doctor" }
        }

        // If not found in Doctor, try Patient table
        const patient = await prisma.patient.findUnique({
            where: { email }
        })

        if (!patient) {
            return { 
                success: false, 
                error: "Invalid email or password" 
            }
        }

        // Verify password for patient
        const passwordMatch = await bcrypt.compare(password, patient.passwordHash)

        if (!passwordMatch) {
            return { 
                success: false, 
                error: "Invalid email or password" 
            }
        }

        // Create session for patient
        const cookieStore = await cookies()
        cookieStore.set("user_id", patient.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        cookieStore.set("user_role", "PATIENT", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        cookieStore.set("user_email", patient.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        cookieStore.set("user_type", "patient", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return { success: true, role: "PATIENT", userType: "patient" }
    } catch (error) {
        console.error("Login error:", error)
        return { 
            success: false, 
            error: "An error occurred during login" 
        }
    }
}

export async function signup(formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        const validation = signupSchema.safeParse({
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
        })

        if (!validation.success) {
            return { 
                success: false, 
                error: validation.error.errors?.[0]?.message || "Invalid form data"
            }
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return { 
                success: false, 
                error: "Passwords do not match" 
            }
        }

        // Check if patient already exists
        const existingPatient = await prisma.patient.findUnique({
            where: { email }
        })

        if (existingPatient) {
            return { 
                success: false, 
                error: "An account with this email already exists" 
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create patient record
        await prisma.patient.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                passwordHash,
                isActive: true,
            }
        })

        // Don't create session - user needs to login
        return { success: true }
    } catch (error: any) {
        console.error("Signup error:", error)
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return { success: false, error: "Email already in use" }
        }
        if (error.code === 'P2003') {
            return { success: false, error: "Invalid data provided" }
        }
        if (error.message?.includes('passwordHash')) {
            return { 
                success: false, 
                error: "Database not updated. Please run: npm run prisma:push" 
            }
        }
        
        return { 
            success: false, 
            error: error.message || "An error occurred during signup" 
        }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("user_id")
    cookieStore.delete("user_role")
    cookieStore.delete("user_email")
    cookieStore.delete("user_type")
    redirect("/login")
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value
        const userType = cookieStore.get("user_type")?.value

        if (!userId) {
            return null
        }

        // Check if it's a patient
        if (userType === "patient") {
            const patient = await prisma.patient.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                }
            })

            if (!patient) return null

            return {
                id: patient.id,
                email: patient.email,
                name: `${patient.firstName} ${patient.lastName}`,
                role: "PATIENT" as Role,
                phone: patient.phone,
                image: null,
            }
        }

        // Check if it's a doctor
        if (userType === "doctor") {
            const doctor = await prisma.doctor.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                }
            })

            if (!doctor) return null

            return {
                id: doctor.id,
                email: doctor.email,
                name: `${doctor.firstName} ${doctor.lastName}`,
                role: "PATIENT" as Role, // Doctors don't have role enum, using PATIENT as placeholder
                phone: doctor.phone,
                image: null,
            }
        }

        // Default to user table
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                image: true,
            }
        })

        return user
    } catch (error) {
        console.error("Get current user error:", error)
        return null
    }
}
