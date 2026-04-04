/*
  Warnings:

  - The primary key for the `app_policy_entries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allowUserRequest` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `autoUpdate` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `blockReason` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `matchType` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `remote` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `remoteUrl` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `removeIfPresent` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `requireReason` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `rule` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `userRemovable` on the `app_policy_entries` table. All the data in the column will be lost.
  - You are about to drop the column `versionConstraint` on the `app_policy_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_policy_entries" DROP CONSTRAINT "app_policy_entries_pkey",
DROP COLUMN "allowUserRequest",
DROP COLUMN "autoUpdate",
DROP COLUMN "blockReason",
DROP COLUMN "id",
DROP COLUMN "matchType",
DROP COLUMN "remote",
DROP COLUMN "remoteUrl",
DROP COLUMN "removeIfPresent",
DROP COLUMN "requireReason",
DROP COLUMN "rule",
DROP COLUMN "source",
DROP COLUMN "userRemovable",
DROP COLUMN "versionConstraint";

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "priority" INTEGER NOT NULL DEFAULT 100,
    "rule" "AppRule" NOT NULL DEFAULT 'OPTIONAL',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_policy_entries" ADD CONSTRAINT "app_policy_entries_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
