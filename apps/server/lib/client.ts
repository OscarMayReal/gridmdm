import { CommandAction, CommandStatus, prisma } from "@repo/database";
import { allowedAppsFromProfile, generateProfileJson, resolveDeviceProfile } from "./profiles";

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
            profile: true,
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
            profile: true,
            installedApps: true,
            enrolledBy: true,
            tenant: true
        }
    });

    const resolvedProfile = await resolveDeviceProfile(deviceId);
    const commands = await prisma.command.findMany({
        where: {
            deviceId
        },
    });

    const apps = resolvedProfile ? allowedAppsFromProfile(resolvedProfile.profile) : [];

    return {
        device,
        profile: resolvedProfile ? generateProfileJson(resolvedProfile) : null,
        profiles: resolvedProfile ? [generateProfileJson(resolvedProfile)] : [],
        policies: resolvedProfile ? [generateProfileJson(resolvedProfile)] : [],
        apps,
        commands
    };
}

export async function requestAppUninstall({ deviceId, appId }: { deviceId: string, appId: string, appPolicyId?: string }) {
    const appEntry = await getAllowedOptionalApp({ deviceId, appId });
    const command = await prisma.command.create({
        data: {
            deviceId,
            action: CommandAction.APP_REMOVE,
            issuedAt: new Date(),
            issuedBy: "device:" + deviceId,
            payload: {
                appId,
                appPolicyId: appEntry.appPolicyId,
                profileId: appEntry.profileId
            }
        }
    });
    return command;
}

export async function requestAppInstall({ deviceId, appId }: { deviceId: string, appId: string, appPolicyId?: string }) {
    const appEntry = await getAllowedOptionalApp({ deviceId, appId });
    const command = await prisma.command.create({
        data: {
            deviceId,
            action: CommandAction.APP_INSTALL,
            issuedAt: new Date(),
            issuedBy: "device:" + deviceId,
            payload: {
                appId,
                appPolicyId: appEntry.appPolicyId,
                profileId: appEntry.profileId
            }
        }
    });
    return command;
}

export async function completeCommand({ deviceId, commandId, status, result, receivedAt }: { deviceId: string, commandId: string, status: string, result?: any, receivedAt?: Date }) {
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
    return prisma.command.update({
        where: {
            id: commandId
        },
        data: {
            status: status as CommandStatus,
            receivedAt: receivedAt || new Date(),
            completedAt: new Date(),
            detail: typeof result === "string" ? result : JSON.stringify(result || {})
        }
    });
}

async function getAllowedOptionalApp({ deviceId, appId }: { deviceId: string, appId: string }) {
    const resolvedProfile = await resolveDeviceProfile(deviceId);
    if (!resolvedProfile) {
        throw new Error("No profile is assigned to this device");
    }

    const appEntry = allowedAppsFromProfile(resolvedProfile.profile).find((entry: any) => entry.appId === appId);
    if (!appEntry) {
        throw new Error("App is not assigned to this device");
    }
    if (appEntry.rule !== "OPTIONAL") {
        throw new Error("App is not optional");
    }

    return {
        ...appEntry,
        profileId: resolvedProfile.profile.id
    };
}
