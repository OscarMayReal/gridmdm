import { CommandAction, CommandStatus, prisma } from "@repo/database";
import { allowedAppsFromProfile, resolveDeviceProfile } from "./profiles";

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

    const policies = resolvedProfile ? [{
        id: resolvedProfile.profile.id,
        version: resolvedProfile.profile.version,
        priority: resolvedProfile.profile.configurations[0]?.priority ?? 0,
        description: resolvedProfile.profile.description,
        meta: {
            author: resolvedProfile.profile.user?.name,
            created: resolvedProfile.profile.createdAt,
            modified: resolvedProfile.profile.updatedAt
        },
        policies: resolvedProfile.profile.configurations
            .filter((entry: any) => entry.configuration.type !== "ALLOWED_APPS")
            .map((entry: any) => ({
                id: entry.configuration.id,
                type: entry.configuration.type,
                description: entry.configuration.description,
                ...(typeof entry.configuration.content === "object" && entry.configuration.content !== null && !Array.isArray(entry.configuration.content) ? entry.configuration.content : {})
            }))
    }] : [];

    const apps = resolvedProfile
        ? resolvedProfile.profile.configurations
            .filter((entry: any) => entry.configuration.type === "ALLOWED_APPS")
            .flatMap((entry: any) =>
                (entry.configuration.content?.apps || []).map((appEntry: any) => ({
                    appPolicyId: entry.configuration.id,
                    ...appEntry
                }))
            )
        : [];

    return {
        device,
        policies,
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
