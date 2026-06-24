import { prisma } from "@repo/database";

const profileInclude = {
    tenant: true,
    configurations: {
        include: {
            configuration: true
        },
        orderBy: {
            priority: "asc" as const
        }
    },
    userAssignments: {
        include: {
            user: true
        }
    },
    devices: true,
    user: true
};

export async function listProfiles({ tenantId }: { tenantId: string }) {
    return prisma.profile.findMany({
        where: { tenantId },
        include: profileInclude,
        orderBy: { createdAt: "desc" }
    });
}

export async function getProfile({ tenantId, profileId }: { tenantId: string, profileId: string }) {
    return prisma.profile.findUnique({
        where: {
            id: profileId,
            tenantId
        },
        include: profileInclude
    });
}

export async function createProfile({ tenantId, data, createdBy }: { tenantId: string, data: any, createdBy: string }) {
    return prisma.profile.create({
        data: {
            name: data.name,
            description: data.description,
            version: data.version || "1.0.0",
            enabled: data.enabled ?? true,
            tenant: { connect: { id: tenantId } },
            user: { connect: { id: createdBy } }
        },
        include: profileInclude
    });
}

export async function updateProfile({ tenantId, profileId, data }: { tenantId: string, profileId: string, data: any }) {
    return prisma.profile.update({
        where: {
            id: profileId,
            tenantId
        },
        data: {
            name: data.name,
            description: data.description,
            version: data.version,
            enabled: data.enabled
        },
        include: profileInclude
    });
}

export async function deleteProfile({ tenantId, profileId }: { tenantId: string, profileId: string }) {
    return prisma.profile.delete({
        where: {
            id: profileId,
            tenantId
        }
    });
}

export async function addConfigurationToProfile({ tenantId, profileId, configurationId, priority }: { tenantId: string, profileId: string, configurationId: string, priority?: number }) {
    await assertProfileAndConfigurationTenant({ tenantId, profileId, configurationId });

    return prisma.profileConfiguration.create({
        data: {
            profileId,
            configurationId,
            priority: priority ?? 0
        },
        include: {
            configuration: true
        }
    });
}

export async function removeConfigurationFromProfile({ profileId, assignmentId }: { profileId: string, assignmentId: string }) {
    return prisma.profileConfiguration.delete({
        where: {
            id: assignmentId,
            profileId
        }
    });
}

export async function assignProfileToUser({ tenantId, profileId, userId }: { tenantId: string, profileId: string, userId: string }) {
    await assertProfileTenant({ tenantId, profileId });

    const existingAssignment = await prisma.profileUserAssignment.findUnique({
        where: { userId },
        include: { profile: true }
    });
    if (existingAssignment) {
        throw new Error("User already has a profile assigned");
    }

    return prisma.profileUserAssignment.create({
        data: {
            profileId,
            userId
        },
        include: {
            user: true
        }
    });
}

export async function unassignProfileFromUser({ profileId, assignmentId }: { profileId: string, assignmentId: string }) {
    return prisma.profileUserAssignment.delete({
        where: {
            id: assignmentId,
            profileId
        }
    });
}

export async function assignProfileToDevice({ tenantId, profileId, deviceId }: { tenantId: string, profileId: string, deviceId: string }) {
    await assertProfileTenant({ tenantId, profileId });

    const device = await prisma.device.findUnique({
        where: {
            id: deviceId,
            tenantId
        }
    });
    if (!device) {
        throw new Error("Device not found");
    }
    if (device.profileId && device.profileId !== profileId) {
        throw new Error("Device already has a profile assigned");
    }

    return prisma.device.update({
        where: {
            id: deviceId,
            tenantId
        },
        data: {
            profileId
        },
        include: {
            profile: true,
            user: true
        }
    });
}

export async function unassignProfileFromDevice({ tenantId, profileId, deviceId }: { tenantId: string, profileId: string, deviceId: string }) {
    const device = await prisma.device.findUnique({
        where: {
            id: deviceId,
            tenantId
        }
    });
    if (!device || device.profileId !== profileId) {
        throw new Error("Device profile assignment not found");
    }

    return prisma.device.update({
        where: {
            id: deviceId,
            tenantId
        },
        data: {
            profileId: null
        }
    });
}

export async function resolveDeviceProfile(deviceId: string) {
    const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
            profile: {
                include: profileInclude
            },
            user: {
                include: {
                    profileAssignments: {
                        include: {
                            profile: {
                                include: profileInclude
                            }
                        }
                    }
                }
            }
        }
    });

    if (!device) return null;

    if (device.enrolmentMethod === "ADMIN_MANUAL" && device.profile) {
        return {
            source: "device",
            profile: device.profile
        };
    }

    const userAssignment = device.user?.profileAssignments[0];
    if (userAssignment?.profile) {
        return {
            source: "user",
            profile: userAssignment.profile
        };
    }

    return null;
}

export function generateProfileJson(resolvedProfile: any) {
    const profile = resolvedProfile.profile;
    return {
        id: profile.id,
        version: profile.version,
        description: profile.description,
        source: resolvedProfile.source,
        meta: {
            author: profile.user?.name,
            created: profile.createdAt,
            modified: profile.updatedAt
        },
        configurations: profile.configurations.map((entry: any) => ({
            id: entry.configuration.id,
            type: entry.configuration.type,
            description: entry.configuration.description,
            ...entry.configuration.content
        })),
        policies: profile.configurations
            .filter((entry: any) => entry.configuration.type !== "ALLOWED_APPS")
            .map((entry: any) => ({
                id: entry.configuration.id,
                type: entry.configuration.type,
                description: entry.configuration.description,
                ...entry.configuration.content
            }))
    };
}

export function allowedAppsFromProfile(profile: any) {
    return profile.configurations
        .filter((entry: any) => entry.configuration.type === "ALLOWED_APPS")
        .flatMap((entry: any) => entry.configuration.content?.apps || []);
}

async function assertProfileTenant({ tenantId, profileId }: { tenantId: string, profileId: string }) {
    const profile = await prisma.profile.findUnique({
        where: {
            id: profileId,
            tenantId
        }
    });
    if (!profile) {
        throw new Error("Profile not found");
    }
}

async function assertProfileAndConfigurationTenant({ tenantId, profileId, configurationId }: { tenantId: string, profileId: string, configurationId: string }) {
    const [profile, configuration] = await Promise.all([
        prisma.profile.findUnique({ where: { id: profileId, tenantId } }),
        prisma.configuration.findUnique({ where: { id: configurationId, tenantId } })
    ]);

    if (!profile) {
        throw new Error("Profile not found");
    }
    if (!configuration) {
        throw new Error("Configuration not found");
    }
}
