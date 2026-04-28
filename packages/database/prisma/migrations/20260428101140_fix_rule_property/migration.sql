/*
  Warnings:

  - You are about to drop the column `rule` on the `app_policy_assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_policy_assignments" DROP COLUMN "rule";

-- AlterTable
ALTER TABLE "app_policy_entries" ADD COLUMN     "rule" "AppRule" NOT NULL DEFAULT 'OPTIONAL';
