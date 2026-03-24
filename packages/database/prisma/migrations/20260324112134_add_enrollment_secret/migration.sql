/*
  Warnings:

  - Added the required column `displayName` to the `organisations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentSecret` to the `organisations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organisations" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "enrollmentSecret" TEXT NOT NULL;
