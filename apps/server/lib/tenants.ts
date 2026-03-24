import { prisma } from "@repo/database";

export async function getTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
        where: {
            id: tenantId,
        },
    })

    if (!tenant) {
        throw new Error(`Tenant with ID ${tenantId} not found`);
    }

    return tenant;
}

export async function createTenant(tenantId: string, name: string, displayName: string, domains: string[]) {
    const tenant = await prisma.tenant.create({
        data: {
            id: tenantId,
            name,
            displayName,
            domains,
            enrollmentToken: crypto.randomUUID(),
        },
    })

    return tenant;
}
