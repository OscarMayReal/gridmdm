/*
  Warnings:

  - You are about to drop the column `displayName` on the `keystone_users` table. All the data in the column will be lost.
  - Added the required column `name` to the `keystone_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `keystone_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `keystone_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "keystone_users" DROP COLUMN "displayName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
