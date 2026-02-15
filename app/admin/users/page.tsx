import { prisma } from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            // passwordHash is excluded for security
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <UsersClient initialUsers={users} />;
}
