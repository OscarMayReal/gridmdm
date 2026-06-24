import { prisma } from "@repo/database";
import { upsertKeystoneUser } from "./keystone";

export async function searchUsers({ tenantId, search, sessionId }: { tenantId: string, search?: string, sessionId?: string }) {
    const keystoneUsers = await searchKeystoneUsers({ tenantId, search, sessionId }).catch(() => []);

    if (keystoneUsers.length > 0) {
        await Promise.all(keystoneUsers.map((user: any) => upsertKeystoneUser({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role || "user"
        })));
        return keystoneUsers;
    }

    return prisma.keyStoneUser.findMany({
        where: {
            OR: [
                { name: { contains: search || "", mode: "insensitive" } },
                { email: { contains: search || "", mode: "insensitive" } },
                { username: { contains: search || "", mode: "insensitive" } }
            ]
        },
        orderBy: { name: "asc" },
        take: 25
    });
}

async function searchKeystoneUsers({ tenantId, search, sessionId }: { tenantId: string, search?: string, sessionId?: string }) {
    if (!process.env.KEYSTONE_URL || !sessionId) return [];

    const url = new URL("/admin/users", process.env.KEYSTONE_URL);
    url.searchParams.set("tenantId", tenantId);
    if (search) url.searchParams.set("search", search);

    const response = await fetch(url, {
        headers: {
            "authorization": `Bearer ${sessionId}`,
            "accept": "application/json"
        }
    });
    if (!response.ok) return [];

    const data: any = await response.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    return [];
}
