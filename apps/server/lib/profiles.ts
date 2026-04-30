import { prisma } from "@repo/database";
import type { EnrolmentProfileCreateInput } from "../../../packages/database/generated/prisma/models";

export async function listProfiles({ tenantId }: { tenantId: string }) {
    const profiles = await prisma.enrolmentProfile.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            conditions: {
                include: {
                    group: true
                }
            },
            tenant: true,
            devices: true,
            assignments: {
                include: {
                    group: true
                }
            }
        }
    });
    return profiles;
}

export async function getProfile({ tenantId, profileId }: { tenantId: string, profileId: string }) {
    const profiles = await prisma.enrolmentProfile.findUnique({
        where: {
            id: profileId,
            tenantId: tenantId
        },
        include: {
            conditions: {
                include: {
                    group: true
                }
            },
            tenant: true,
            devices: true,
            assignments: {
                include: {
                    group: true
                }
            }
        }
    });
    return profiles;
}

export async function updateProfile({ tenantId, profileId, data }: { tenantId: string, profileId: string, data: any }) {
    const profiles = await prisma.enrolmentProfile.update({
        where: {
            id: profileId,
            tenantId: tenantId
        },
        data: data
    });
    return profiles;
}

export async function createProfile({ tenantId, data }: { tenantId: string, data: EnrolmentProfileCreateInput }) {
    const profiles = await prisma.enrolmentProfile.create({
        data: {
            ...data,
            tenant: {
                connect: {
                    id: tenantId
                }
            }
        },
        include: {
            conditions: {
                include: {
                    group: true
                }
            },
            tenant: true,
            devices: true,
            assignments: true
        }
    });
    return profiles;
}

export async function deleteProfile({ tenantId, profileId }: { tenantId: string, profileId: string }) {
    const profiles = await prisma.enrolmentProfile.delete({
        where: {
            id: profileId,
            tenantId: tenantId
        }
    });
    return profiles;
}

export async function createProfileCondition({ tenantId, profileId, data }: { tenantId: string, profileId: string, data: any }) {
    const profileCondition = await prisma.enrolmentProfileCondition.create({
        data: {
            tenantId: tenantId,
            profileId: profileId,
            ...data
        },
        include: {
            group: true,
            profile: true
        }
    });
    return profileCondition;
}

export async function deleteProfileCondition({ profileId, conditionId }: { profileId: string, conditionId: string }) {
    const profileCondition = await prisma.enrolmentProfileCondition.delete({
        where: {
            id: conditionId,
            profileId: profileId
        }
    });
    return profileCondition;
}

export async function createProfileGroupAssignment({ profileId, groupId }: { profileId: string, groupId: string }) {
    const profileAssignment = await prisma.enrolmentProfileGroupAssignment.create({
        data: {
            profileId: profileId,
            groupId: groupId
        },
        include: {
            group: true,
            profile: true
        }
    });
    return profileAssignment;
}

export async function deleteProfileGroupAssignment({ profileId, assignmentId }: { profileId: string, assignmentId: string }) {
    const profileAssignment = await prisma.enrolmentProfileGroupAssignment.delete({
        where: {
            id: assignmentId,
            profileId: profileId
        }
    });
    return profileAssignment;
}