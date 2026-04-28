/*
  Warnings:

  - You are about to drop the column `rule` on the `apps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_policy_assignments" ADD COLUMN     "rule" "AppRule" NOT NULL DEFAULT 'OPTIONAL';

-- AlterTable
ALTER TABLE "apps" DROP COLUMN "rule";
