import { CommandAction, CommandStatus, prisma, type AppPolicyAssignment } from "@repo/database";
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
    const Commands = await prisma.command.findMany({
        where: {
            deviceId: deviceId
        },
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
        apps: appsList,
        commands: Commands
    };
}

export async function requestAppUninstall({deviceId, appId, appPolicyId}: {deviceId: string, appId: string, appPolicyId: string}) {
    const app = await prisma.appPolicyEntry.findUnique({
        where: {
            appPolicyId_appId: {
                appPolicyId: appPolicyId,
                appId: appId
            }
        },
        include: {
            app: true,
            appPolicy: {
                include: {
                    assignments: {
                        include: {
                            group: {
                                include: {
                                    devices: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const device = await prisma.device.findUnique({
        where: {
            id: deviceId
        },
        include: {
            groups: true
        }
    });
    if (!app) {
        throw new Error("App not found");
    }
    if (!device || !device.groups.some((group: any) => app.appPolicy?.assignments.some((assignment: AppPolicyAssignment) => assignment.groupId === group.groupId))) {
        throw new Error("App is not assigned to this device");
    }
    if (app.rule !== "OPTIONAL") {
        throw new Error("App is not optional");
    }
    const command = await prisma.command.create({
        data: {
            deviceId: deviceId,
            action: CommandAction.APP_REMOVE,
            issuedAt: new Date(),
            issuedBy: "device:" + deviceId,
            payload: {
                appId: appId,
                appPolicyId: appPolicyId
            }
        }
    });
    return command;
}

export async function requestAppInstall({deviceId, appId, appPolicyId}: {deviceId: string, appId: string, appPolicyId: string}) {
    const app = await prisma.appPolicyEntry.findUnique({
        where: {
            appPolicyId_appId: {
                appPolicyId: appPolicyId,
                appId: appId
            }
        },
        include: {
            app: true,
            appPolicy: {
                include: {
                    assignments: {
                        include: {
                            group: {
                                include: {
                                    devices: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const device = await prisma.device.findUnique({
        where: {
            id: deviceId
        },
        include: {
            groups: true
        }
    });
    if (!app) {
        throw new Error("App not found");
    }
    if (!device || !device.groups.some((group: any) => app.appPolicy?.assignments.some((assignment: AppPolicyAssignment) => assignment.groupId === group.groupId))) {
        throw new Error("App is not assigned to this device");
    }
    if (app.rule !== "OPTIONAL") {
        throw new Error("App is not optional");
    }
    const command = await prisma.command.create({
        data: {
            deviceId: deviceId,
            action: CommandAction.APP_INSTALL,
            issuedAt: new Date(),
            issuedBy: "device:" + deviceId,
            payload: {
                appId: appId,
                appPolicyId: appPolicyId
            }
        }
    });
    return command;
}

export async function completeCommand({deviceId, commandId, status, result, receivedAt}: {deviceId: string, commandId: string, status: string, result?: any, receivedAt?: Date}) {
    const command = await prisma.command.findUnique({
        where: {
            id: commandId
        }
    });
    if (!command) {
        throw new Error("Command not found");
    }
    if (command.deviceId !== deviceId) {
        throw new Error("Command does not belong to this device");
    }
    const updatedCommand = await prisma.command.update({
        where: {
            id: commandId
        },
        data: {
            status: status as CommandStatus,
            receivedAt: receivedAt || new Date(),
            completedAt: new Date()
        }
    });
}
