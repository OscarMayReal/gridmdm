import { prisma } from "@repo/database";
import { GeneratePolicyJson } from "./policies";

export function getDevice(deviceId: string) {
    return prisma.device.findUnique({
        where: {
            id: deviceId
        },
        include: {
            groups: {
                include: {
                    group: true
                }
            },
            token: true,
            user: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true
        }
    });
}

export async function getManifest(deviceId: string) {
    const device = await prisma.device.findUnique({
        where: {
            id: deviceId
        },
        include: {
            groups: {
                include: {
                    group: true
                }
            },
            user: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true
        }
    });
    const policies = await prisma.policy.findMany({
        where: {
            assignments: {
                some: {
                    group: {
                        id: {
                            in: device?.groups.map((group) => group.groupId)
                        }
                    }
                }
            }
        },
        select: {
            id: true,
        }
    });
    const appPolicies = await prisma.appPolicy.findMany({
        where: {
            assignments: {
                some: {
                    group: {
                        id: {
                            in: device?.groups.map((group) => group.groupId)
                        }
                    }
                }
            }
        },
        include: {
            apps: {
                include: {
                    app: true
                }
            }
        }
    });
    var policiesList: any[] = [];
    for (const policy of policies) {
        policiesList.push(await GeneratePolicyJson(policy.id));
    }
    var appsList: any[] = [];
    for (const appPolicy of appPolicies) {
        appsList.push(...appPolicy.apps.map((app) => app));
    }
    return {
        device: device,
        policies: policiesList,
        apps: appsList
    };
}