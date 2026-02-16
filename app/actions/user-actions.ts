"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    password: z.union([
        z.string().min(6, "Password must be at least 6 characters"),
        z.string().length(0)
    ]).optional(),
    role: z.nativeEnum(Role),
})

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) return error.message
    return fallback
}

function getErrorCode(error: unknown): string | undefined {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = (error as { code?: unknown }).code
        if (typeof code === "string") return code
    }
    return undefined
}

export async function updateUser(userId: string, formData: FormData) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const role = formData.get("role") as Role
        const imageFile = formData.get("image") as File | null

        const validation = updateUserSchema.safeParse({
            name,
            email,
            phone,
            password: password || undefined,
            role,
        })

        if (!validation.success) {
            console.error("Validation error:", validation.error)
            return { success: false, error: validation.error.issues?.[0]?.message || "Invalid form data" }
        }

        // Check if email is being changed and if it's already taken by another user
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser && existingUser.id !== userId) {
            return { success: false, error: "Email already in use by another user" }
        }

        let imageUrl: string | undefined = undefined

        // Handle File Upload
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0 && imageFile.name !== "undefined") {
            try {
                const bytes = await imageFile.arrayBuffer()
                const buffer = Buffer.from(bytes)

                const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')
                const filename = `${Date.now()}-${safeName}`

                const relativeUploadPath = `/uploads/avatars`
                const uploadDir = join(process.cwd(), "public", "uploads", "avatars")

                await mkdir(uploadDir, { recursive: true })

                const filepath = join(uploadDir, filename)
                await writeFile(filepath, buffer)

                imageUrl = `${relativeUploadPath}/${filename}`
            } catch (fileError) {
                console.error("File upload failed:", fileError);
            }
        }

        // Prepare update data
        const updateData: Prisma.UserUpdateInput = {
            name,
            email,
            role,
            phone: phone || null,
        }

        // Only update password if provided
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10)
        }

        // Only update image if new one was uploaded
        if (imageUrl) {
            updateData.image = imageUrl
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error: unknown) {
        console.error("Failed to update user:", error)
        // Log more details for debugging
        const errorCode = getErrorCode(error)
        if (errorCode === 'P2002') {
            return { success: false, error: "Email already in use" }
        }
        if (errorCode === 'P2025') {
            return { success: false, error: "User not found" }
        }
        // Return more specific error message
        const errorMessage = getErrorMessage(error, "Failed to update user. Please try again.")
        return { success: false, error: errorMessage }
    }
}

export async function deleteUser(userId: string) {
    try {
        // Prevent deleting your own account (optional safety check)
        // You might want to pass the current user's ID here to check
        
        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete user:", error)
        return { success: false, error: "Failed to delete user. Please try again." }
    }
}

export async function getUser(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true, user }
    } catch (error) {
        console.error("Failed to get user:", error)
        return { success: false, error: "Failed to get user." }
    }
}
