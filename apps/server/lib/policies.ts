import { prisma, type Policy } from "@repo/database";
import type { PolicyCreateInput } from "../../../packages/database/generated/prisma/models";

export async function listPolicies({ tenantId }: { tenantId: string }) {
    const profiles = await prisma.policy.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            tenant: true,
            assignments: {
                include: {
                    group: true
                }
            },
            blocks: true
        }
    });
    return profiles;
}

export async function getPolicy({ tenantId, policyId }: { tenantId: string, policyId: string }) {
    const profiles = await prisma.policy.findUnique({
        where: {
            id: policyId,
            tenantId: tenantId
        },
        include: {
            tenant: true,
            assignments: {
                include: {
                    group: true
                }
            },
            blocks: true
        }
    });
    return profiles;
}

export async function updatePolicy({ tenantId, policyId, data }: { tenantId: string, policyId: string, data: any }) {
    const profiles = await prisma.policy.update({
        where: {
            id: policyId,
            tenantId: tenantId
        },
        data: data
    });
    return profiles;
}

export async function createPolicy({ tenantId, priority, description, name, createdBy }: { tenantId: string, priority: number, description: string, name: string, createdBy: string }) {
    const policy = await prisma.policy.create({
        data: {
            priority: priority,
            description: description,
            name: name,
            tenant: {
                connect: {
                    id: tenantId
                }
            },
            // createdBy: createdBy,
            user: {
                connect: {
                    id: createdBy
                }
            }
        },
        include: {
            tenant: true,
            assignments: {
                include: {
                    group: true
                }
            },
            blocks: true
        }
    });
    return policy;
}

export async function deletePolicy({ tenantId, policyId }: { tenantId: string, policyId: string }) {
    const profiles = await prisma.policy.delete({
        where: {
            id: policyId,
            tenantId: tenantId
        }
    });
    return profiles;
}

export async function createPolicyBlock({ policyId, data }: { policyId: string, data: any }) {
    const profileCondition = await prisma.policyBlock.create({
        data: {
            policyId: policyId,
            ...data
        },
        include: {
            policy: true
        }
    });
    return profileCondition;
}

export async function updatePolicyBlock({ policyId, blockId, data }: { policyId: string, blockId: string, data: any }) {
    const profileCondition = await prisma.policyBlock.update({
        where: {
            id: blockId,
            policyId: policyId
        },
        data: data
    });
    return profileCondition;
}

export async function deletePolicyBlock({ policyId, blockId }: { policyId: string, blockId: string }) {
    const profileCondition = await prisma.policyBlock.delete({
        where: {
            id: blockId,
            policyId: policyId
        }
    });
    return profileCondition;
}

export async function createPolicyGroupAssignment({ policyId, groupId }: { policyId: string, groupId: string }) {
    const profileAssignment = await prisma.policyAssignment.create({
        data: {
            policyId: policyId,
            groupId: groupId
        }
    });
    return profileAssignment;
}

export async function deletePolicyGroupAssignment({ policyId, assignmentId }: { policyId: string, assignmentId: string }) {
    const profileAssignment = await prisma.policyAssignment.delete({
        where: {
            id: assignmentId,
            policyId: policyId
        }
    });
    return profileAssignment;
}

export async function GeneratePolicyJson(policyId: string) {
    const policy = await prisma.policy.findUnique({
        where: {
            id: policyId
        },
        include: {
            tenant: true,
            assignments: {
                include: {
                    group: true
                }
            },
            blocks: true,
            user: true
        }
    });
    if (!policy) {
        throw new Error("Policy not found");
    }
    const json = {
        "id": policy.id,
        "version": policy.version,
        "priority": policy.priority,
        "description": policy.description,

        "meta": {
            "author": policy.user.name,
            "created": policy.createdAt,
            "modified": policy.updatedAt,
        },

        "policies": policy.blocks.map((block) => {
            return {
                type: block.type,
                description: block.description,
                ...(typeof block.content === "object" && block.content !== null && !Array.isArray(block.content) ? block.content : {}),
            }
        })
    }
    return json;
}
