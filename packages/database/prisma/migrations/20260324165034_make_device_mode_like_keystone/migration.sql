/*
  Warnings:

  - You are about to drop the column `hostname` on the `devices` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSelfEnrolled` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceHardwareType" AS ENUM ('LAPTOP', 'PHONE', 'TABLET', 'SERVER', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceSoftwareType" AS ENUM ('THETAOS', 'ANDROID', 'OTHER');

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "hostname",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "extraInfo" JSONB,
ADD COLUMN     "hardwareType" "DeviceHardwareType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "isSelfEnrolled" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "os" TEXT NOT NULL,
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "softwareType" "DeviceSoftwareType" NOT NULL DEFAULT 'OTHER';
