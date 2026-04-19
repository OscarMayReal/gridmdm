/*
  Warnings:

  - Added the required column `appId` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "apps" ADD COLUMN     "appId" TEXT NOT NULL;
