/*
  Warnings:

  - You are about to drop the column `enrollmentSecret` on the `organisations` table. All the data in the column will be lost.
  - Added the required column `enrollmentToken` to the `organisations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organisations" DROP COLUMN "enrollmentSecret",
ADD COLUMN     "enrollmentToken" TEXT NOT NULL;
