import { prisma } from "@repo/database";

export async function listdevices({ tenantId }: { tenantId: string }) {
    const devices = await prisma.device.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            groups: {
                include: {
                    group: true
                }
            },
            assignedUser: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true
        }
    });
    return devices;
}
