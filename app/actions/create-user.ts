"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role),
})

export async function createUser(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const role = formData.get("role") as Role
        const imageFile = formData.get("image") as File | null

        const validation = createUserSchema.safeParse({
            name,
            email,
            phone,
            password,
            role,
        })

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message }
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return { success: false, error: "User already exists" }
        }

        let imageUrl: string | undefined = undefined

        // Handle File Upload - wrapped in try/catch to avoid hard crash
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0 && imageFile.name !== "undefined") {
            try {
                const bytes = await imageFile.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Ensure unique filename and safe name
                // Replace risky chars with dash
                const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')
                const filename = `${Date.now()}-${safeName}`

                // Use relative path for URL (forward slashes)
                const relativeUploadPath = `/uploads/avatars`

                // Use system path for filesystem
                const uploadDir = join(process.cwd(), "public", "uploads", "avatars")

                await mkdir(uploadDir, { recursive: true })

                const filepath = join(uploadDir, filename)
                await writeFile(filepath, buffer)

                imageUrl = `${relativeUploadPath}/${filename}`
            } catch (fileError) {
                console.error("File upload failed, creating user without image:", fileError);
                // Optionally: return { success: false, error: "File upload failed" }
                // But we can just proceed without image
            }
        }

        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
                phone: phone || null,
                image: imageUrl || null,
            },
        })

        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Failed to create user (General Error):", error)
        // Ensure we return a serializable object, not throw
        return { success: false, error: "Failed to create user. Please try again." }
    }
}
