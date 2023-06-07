/*
  Warnings:

  - A unique constraint covering the columns `[id,memberId]` on the table `RegistrationStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RegistrationStatus" ADD COLUMN     "reviewedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationStatus_id_memberId_key" ON "RegistrationStatus"("id", "memberId");
