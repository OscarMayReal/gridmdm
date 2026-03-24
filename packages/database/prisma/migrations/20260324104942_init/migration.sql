-- CreateEnum
CREATE TYPE "EnrolmentMethod" AS ENUM ('KEYSTONE_ACCOUNT', 'ADMIN_MANUAL', 'USB_INSTALLER');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ENROLLING', 'MANAGED', 'BLOCKED', 'UNENROLLED');

-- CreateEnum
CREATE TYPE "DeviceMode" AS ENUM ('OPEN', 'MANAGED', 'KIOSK');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('DEVICE_POLICY', 'APP_POLICY');

-- CreateEnum
CREATE TYPE "PolicyBlockType" AS ENUM ('DCONF', 'FILE', 'EXEC', 'SYSTEMD', 'LAPS');

-- CreateEnum
CREATE TYPE "AppRule" AS ENUM ('FORCED', 'OPTIONAL', 'ALLOWED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AppSource" AS ENUM ('FLATPAK', 'SNAP');

-- CreateEnum
CREATE TYPE "AppRequestStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'DENIED', 'INSTALLED', 'FAILED');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('QUEUED', 'RECEIVED', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommandAction" AS ENUM ('APP_INSTALL', 'APP_REMOVE', 'REEVALUATE_POLICY', 'LOGOUT_USER', 'BLOCK_DEVICE', 'UNBLOCK_DEVICE', 'LAPS_ROTATE', 'UPDATE_AGENT');

-- CreateEnum
CREATE TYPE "OnConflict" AS ENUM ('OVERWRITE', 'SKIP', 'FORCE', 'ABORT');

-- CreateTable
CREATE TABLE "organisations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domains" TEXT[],
    "mdmEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keystone_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "keystone_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keystone_users" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keystone_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "arch" TEXT NOT NULL,
    "osVersion" TEXT NOT NULL,
    "enrolmentMethod" "EnrolmentMethod" NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "lastPolicyApply" TIMESTAMP(3),
    "status" "DeviceStatus" NOT NULL DEFAULT 'ENROLLING',
    "agentVersion" TEXT,
    "mdmTags" TEXT[],
    "enrolledById" TEXT,
    "assignedUserId" TEXT,
    "enrolmentProfileId" TEXT,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_groups" (
    "deviceId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "device_groups_pkey" PRIMARY KEY ("deviceId","groupId")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_blocks" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "message" TEXT,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedBy" TEXT NOT NULL,

    CONSTRAINT "device_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrolment_profiles" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "features" TEXT[],
    "requiresConfirmation" BOOLEAN NOT NULL DEFAULT true,
    "confirmationMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrolment_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrolment_profile_conditions" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "enrolment_profile_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrolment_profile_group_assignments" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "enrolment_profile_group_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_assignments" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "groupId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "policy_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_blocks" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "type" "PolicyBlockType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "content" JSONB NOT NULL,

    CONSTRAINT "policy_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_policies" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "deviceMode" "DeviceMode" NOT NULL DEFAULT 'MANAGED',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "app_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_policy_assignments" (
    "id" TEXT NOT NULL,
    "appPolicyId" TEXT NOT NULL,
    "groupId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "app_policy_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_policy_entries" (
    "id" TEXT NOT NULL,
    "appPolicyId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "source" "AppSource" NOT NULL,
    "remote" TEXT,
    "remoteUrl" TEXT,
    "rule" "AppRule" NOT NULL,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT true,
    "userRemovable" BOOLEAN NOT NULL DEFAULT true,
    "allowUserRequest" BOOLEAN NOT NULL DEFAULT false,
    "requireReason" BOOLEAN NOT NULL DEFAULT false,
    "removeIfPresent" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "versionConstraint" TEXT,
    "matchType" TEXT NOT NULL DEFAULT 'exact',

    CONSTRAINT "app_policy_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installed_apps" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "source" "AppSource" NOT NULL,
    "version" TEXT NOT NULL,
    "installSource" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installed_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_requests" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "source" "AppSource" NOT NULL,
    "remote" TEXT,
    "reason" TEXT,
    "status" "AppRequestStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "commandId" TEXT,

    CONSTRAINT "app_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "action" "CommandAction" NOT NULL,
    "payload" JSONB,
    "status" "CommandStatus" NOT NULL DEFAULT 'QUEUED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "detail" TEXT,

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_laps" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'RSA-OAEP-256',
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "rotationRequested" BOOLEAN NOT NULL DEFAULT false,
    "lastRetrievedBy" TEXT,
    "lastRetrievedAt" TIMESTAMP(3),

    CONSTRAINT "device_laps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keystone_users_email_key" ON "keystone_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_deviceId_key" ON "device_tokens"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "device_blocks_deviceId_key" ON "device_blocks"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "enrolment_profile_conditions_profileId_groupId_key" ON "enrolment_profile_conditions"("profileId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "app_policy_entries_appPolicyId_appId_key" ON "app_policy_entries"("appPolicyId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "installed_apps_deviceId_appId_key" ON "installed_apps"("deviceId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "app_requests_commandId_key" ON "app_requests"("commandId");

-- CreateIndex
CREATE UNIQUE INDEX "device_laps_deviceId_key" ON "device_laps"("deviceId");

-- AddForeignKey
ALTER TABLE "keystone_groups" ADD CONSTRAINT "keystone_groups_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_enrolledById_fkey" FOREIGN KEY ("enrolledById") REFERENCES "keystone_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "keystone_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_enrolmentProfileId_fkey" FOREIGN KEY ("enrolmentProfileId") REFERENCES "enrolment_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_groups" ADD CONSTRAINT "device_groups_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_groups" ADD CONSTRAINT "device_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "keystone_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_blocks" ADD CONSTRAINT "device_blocks_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolment_profiles" ADD CONSTRAINT "enrolment_profiles_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolment_profile_conditions" ADD CONSTRAINT "enrolment_profile_conditions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "enrolment_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolment_profile_conditions" ADD CONSTRAINT "enrolment_profile_conditions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "keystone_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolment_profile_group_assignments" ADD CONSTRAINT "enrolment_profile_group_assignments_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "enrolment_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_assignments" ADD CONSTRAINT "policy_assignments_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_assignments" ADD CONSTRAINT "policy_assignments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "keystone_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_blocks" ADD CONSTRAINT "policy_blocks_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_policies" ADD CONSTRAINT "app_policies_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_policy_assignments" ADD CONSTRAINT "app_policy_assignments_appPolicyId_fkey" FOREIGN KEY ("appPolicyId") REFERENCES "app_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_policy_entries" ADD CONSTRAINT "app_policy_entries_appPolicyId_fkey" FOREIGN KEY ("appPolicyId") REFERENCES "app_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installed_apps" ADD CONSTRAINT "installed_apps_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_requests" ADD CONSTRAINT "app_requests_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_requests" ADD CONSTRAINT "app_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "keystone_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_requests" ADD CONSTRAINT "app_requests_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "commands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_laps" ADD CONSTRAINT "device_laps_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
