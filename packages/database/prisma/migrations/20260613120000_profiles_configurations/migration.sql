-- Add reusable configurations and ABM-style profiles.
ALTER TYPE "PolicyBlockType" ADD VALUE IF NOT EXISTS 'ALLOWED_APPS';

ALTER TABLE "devices" ADD COLUMN IF NOT EXISTS "profileId" TEXT;

CREATE TABLE IF NOT EXISTS "profiles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "configurations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PolicyBlockType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "profile_configurations" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "profile_configurations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "profile_user_assignments" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_user_assignments_pkey" PRIMARY KEY ("id")
);

INSERT INTO "configurations" ("id", "tenantId", "name", "description", "type", "content", "createdAt", "updatedAt", "createdBy")
SELECT
    pb."id",
    p."tenantId",
    COALESCE(NULLIF(pb."description", ''), 'Imported ' || pb."type"::TEXT || ' configuration'),
    pb."description",
    pb."type",
    pb."content",
    pb."createdAt",
    pb."updatedAt",
    p."createdBy"
FROM "policy_blocks" pb
JOIN "policies" p ON p."id" = pb."policyId"
ON CONFLICT ("id") DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS "profile_configurations_profileId_configurationId_key" ON "profile_configurations"("profileId", "configurationId");
CREATE UNIQUE INDEX IF NOT EXISTS "profile_user_assignments_userId_key" ON "profile_user_assignments"("userId");

ALTER TABLE "profiles" ADD CONSTRAINT "profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "keystone_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "keystone_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profile_configurations" ADD CONSTRAINT "profile_configurations_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_configurations" ADD CONSTRAINT "profile_configurations_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_user_assignments" ADD CONSTRAINT "profile_user_assignments_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_user_assignments" ADD CONSTRAINT "profile_user_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "keystone_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "devices" ADD CONSTRAINT "devices_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
