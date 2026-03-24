/*
  Warnings:

  - You are about to drop the column `orgId` on the `app_policies` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `enrolment_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `keystone_groups` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `policies` table. All the data in the column will be lost.
  - Added the required column `tenantId` to the `app_policies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `enrolment_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupname` to the `keystone_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `keystone_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `policies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_policies" DROP CONSTRAINT "app_policies_orgId_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_orgId_fkey";

-- DropForeignKey
ALTER TABLE "enrolment_profiles" DROP CONSTRAINT "enrolment_profiles_orgId_fkey";

-- DropForeignKey
ALTER TABLE "keystone_groups" DROP CONSTRAINT "keystone_groups_orgId_fkey";

-- DropForeignKey
ALTER TABLE "policies" DROP CONSTRAINT "policies_orgId_fkey";

-- AlterTable
ALTER TABLE "app_policies" DROP COLUMN "orgId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "orgId",
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "enrolment_profiles" DROP COLUMN "orgId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "keystone_groups" DROP COLUMN "orgId",
ADD COLUMN     "groupname" TEXT NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "policies" DROP COLUMN "orgId",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "keystone_groups" ADD CONSTRAINT "keystone_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrolment_profiles" ADD CONSTRAINT "enrolment_profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_policies" ADD CONSTRAINT "app_policies_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
