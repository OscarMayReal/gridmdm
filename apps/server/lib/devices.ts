import { prisma } from "@repo/database";

export async function listdevices({ tenantId }: { tenantId: string }) {
    const devices = await prisma.device.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            groups: {
                include: {
                    group: {
                        include: {
                            policyAssignments: true,
                            appPolicyAssignments: true
                        }
                    }
                }
            },
            enrolmentProfile: true,
            user: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true
        }
    });
    return devices;
}

export async function getdevice({ tenantId, deviceId }: { tenantId: string, deviceId: string }) {
    const device = await prisma.device.findUnique({
        where: {
            id: deviceId,
            tenantId: tenantId
        },
        include: {
            groups: {
                include: {
                    group: {
                        include: {
                            policyAssignments: {
                                include: {
                                    policy: true
                                }
                            },
                            appPolicyAssignments: {
                                include: {
                                    appPolicy: true
                                }
                            }
                        }
                    }
                }
            },
            enrolmentProfile: true,
            commands: true,
            user: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true,
            token: true
        }
    });
    return device;
}

export async function updateDevice({ tenantId, deviceId, data }: { tenantId: string, deviceId: string, data: any }) {
    const device = await prisma.device.update({
        where: {
            id: deviceId,
            tenantId: tenantId
        },
        data: data
    });
    return device;
}