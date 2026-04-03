import { prisma } from "@repo/database";
import { GeneratePolicyJson } from "./policies";

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
    var policiesList: any[] = [];
    for (const policy of policies) {
        policiesList.push(await GeneratePolicyJson(policy.id));
    }
    return {
        device: device,
        policies: policiesList
    };
}