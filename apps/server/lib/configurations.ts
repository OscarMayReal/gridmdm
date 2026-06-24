import { prisma } from "@repo/database";

export async function listConfigurations({ tenantId }: { tenantId: string }) {
    return prisma.configuration.findMany({
        where: { tenantId },
        include: {
            profiles: {
                include: {
                    profile: true
                }
            },
            user: true
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function getConfiguration({ tenantId, configurationId }: { tenantId: string, configurationId: string }) {
    return prisma.configuration.findUnique({
        where: {
            id: configurationId,
            tenantId
        },
        include: {
            profiles: {
                include: {
                    profile: true
                }
            },
            user: true
        }
    });
}

export async function createConfiguration({ tenantId, createdBy, data }: { tenantId: string, createdBy: string, data: any }) {
    return prisma.configuration.create({
        data: {
            tenantId,
            createdBy,
            name: data.name,
            description: data.description,
            type: data.type,
            content: defaultContentForType(data.type, data.content)
        }
    });
}

export async function updateConfiguration({ tenantId, configurationId, data }: { tenantId: string, configurationId: string, data: any }) {
    return prisma.configuration.update({
        where: {
            id: configurationId,
            tenantId
        },
        data: {
            name: data.name,
            description: data.description,
            content: data.content
        }
    });
}

export async function deleteConfiguration({ tenantId, configurationId }: { tenantId: string, configurationId: string }) {
    return prisma.configuration.delete({
        where: {
            id: configurationId,
            tenantId
        }
    });
}

function defaultContentForType(type: string, content?: any) {
    if (content) return content;

    switch (type) {
        case "DCONF":
            return { settings: [] };
        case "FILE":
            return { files: [] };
        case "EXEC":
            return { commands: [] };
        case "SYSTEMD":
            return { services: [] };
        case "LAPS":
            return { laps: {} };
        case "ALLOWED_APPS":
            return { apps: [] };
        default:
            return {};
    }
}
