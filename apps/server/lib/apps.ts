import { prisma, type Policy } from "@repo/database";
import type { EnrolmentProfileCreateInput } from "../../../packages/database/generated/prisma/models";

export async function listTenantApps({ tenantId }: { tenantId: string }) {
    const profiles = await prisma.app.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            appPolicies: {
                include: {
                    appPolicy: {
                        include: {
                            assignments: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return profiles;
}

export async function getApp({ tenantId, appId }: { tenantId: string, appId: string }) {
    const profiles = await prisma.app.findUnique({
        where: {
            id: appId,
            tenantId: tenantId
        },
        include: {
            appPolicies: {
                include: {
                    appPolicy: {
                        include: {
                            assignments: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return profiles;
}

export async function updateApp({ tenantId, appId, data }: { tenantId: string, appId: string, data: any }) {
    const profiles = await prisma.app.update({
        where: {
            id: appId,
            tenantId: tenantId
        },
        data: data
    });
    return profiles;
}

export async function createApp({ tenantId, appId, name, description, version, userId }: { tenantId: string, appId: string, name: string, description: string, version: string, userId: string }) {
    const profiles = await prisma.app.create({
        data: {
            appId: appId,
            name: name,
            description: description,
            createdBy: userId,
            version: version,
            tenantId: tenantId
        },
        include: {
            appPolicies: {
                include: {
                    appPolicy: {
                        include: {
                            assignments: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return profiles;
}

export async function deleteApp({ tenantId, appId }: { tenantId: string, appId: string }) {
    const profiles = await prisma.app.delete({
        where: {
            id: appId,
            tenantId: tenantId
        }
    });
    return profiles;
}

export async function assignAppToPolicy({ appId, appPolicyId }: { appId: string, appPolicyId: string }) {
    const profileAssignment = await prisma.appPolicyEntry.create({
        data: {
            appId: appId,
            appPolicyId: appPolicyId
        }
    });
    return profileAssignment;
}

export async function unassignAppFromPolicy({ appId, appPolicyId }: { appId: string, appPolicyId: string }) {
    const profileAssignment = await prisma.appPolicyEntry.delete({
        where: {
            appPolicyId_appId: { appPolicyId, appId }
        }
    });
    return profileAssignment;
}

export async function listAppPolicies({ tenantId }: { tenantId: string }) {
    const profiles = await prisma.appPolicy.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            apps: {
                include: {
                    app: true
                }
            },
            assignments: {
                include: {
                    group: true
                }
            }
        }
    });
    return profiles;
}

export async function createAppPolicy({ appId, data }: { appId: string, data: any }) {
    const profileCondition = await prisma.appPolicy.create({
        data: {
            appId: appId,
            ...data
        },
        include: {
            apps: {
                include: {
                    app: true
                }
            },
            assignments: {
                include: {
                    group: true
                }
            }
        }
    });
    return profileCondition;
}

export async function updateAppPolicy({ tenantId, policyId, data }: { tenantId: string, policyId: string, data: any }) {
    const profileCondition = await prisma.appPolicy.update({
        where: {
            id: policyId,
            tenantId: tenantId
        },
        data: data
    });
    return profileCondition;
}

export async function deleteAppPolicy({ tenantId, policyId }: { tenantId: string, policyId: string }) {
    const profileCondition = await prisma.appPolicy.delete({
        where: {
            id: policyId,
            tenantId: tenantId
        }
    });
    return profileCondition;
}

export async function createAppPolicyGroupAssignment({ policyId, groupId }: { policyId: string, groupId: string }) {
    const profileAssignment = await prisma.appPolicyAssignment.create({
        data: {
            appPolicyId: policyId,
            groupId: groupId
        }
    });
    return profileAssignment;
}

export async function deleteAppPolicyGroupAssignment({ policyId, assignmentId }: { policyId: string, assignmentId: string }) {
    const profileAssignment = await prisma.appPolicyAssignment.delete({
        where: {
            id: assignmentId,
            appPolicyId: policyId
        }
    });
    return profileAssignment;
}