import { prisma } from "@repo/database";
import type { EnrolmentProfileCreateInput } from "../../../packages/database/generated/prisma/models";

export async function listGroups({ tenantId }: { tenantId: string }) {
    const profiles = await prisma.keyStoneGroup.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            tenant: true,
            devices: true,
            appPolicyAssignments: true,
            policyAssignments: true,
            profileAssignments: true,
            profileConditions: true,
        }
    });
    return profiles;
}

export async function getGroup({ tenantId, groupId }: { tenantId: string, groupId: string }) {
    const profiles = await prisma.keyStoneGroup.findUnique({
        where: {
            id: groupId,
            tenantId: tenantId
        },
        include: {
            tenant: true,
            devices: true,
            appPolicyAssignments: true,
            policyAssignments: true,
            profileAssignments: true,
            profileConditions: true
        }
    });
    return profiles;
}

export async function updateGroup({ tenantId, groupId, data }: { tenantId: string, groupId: string, data: any }) {
    const profiles = await prisma.keyStoneGroup.update({
        where: {
            id: groupId,
            tenantId: tenantId
        },
        data: data
    });
    return profiles;
}

export async function createGroup({ tenantId, data }: { tenantId: string, data: EnrolmentProfileCreateInput }) {
    const profiles = await prisma.keyStoneGroup.create({
        data: {
            ...data,
            tenant: {
                connect: {
                    id: tenantId
                }
            }
        },
        include: {
            tenant: true,
            devices: true
        }
    });
    return profiles;
}

export async function deleteGroup({ tenantId, groupId }: { tenantId: string, groupId: string }) {
    const profiles = await prisma.keyStoneGroup.delete({
        where: {
            id: groupId,
            tenantId: tenantId
        }
    });
    return profiles;
}