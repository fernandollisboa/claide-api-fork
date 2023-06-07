/*
  Warnings:

  - You are about to drop the column `memberUsername` on the `ServiceAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `ServiceAssociation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId,memberId]` on the table `ServiceAssociation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `ServiceAssociation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `ServiceAssociation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_memberUsername_fkey";

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_serviceName_fkey";

-- DropIndex
DROP INDEX "ServiceAssociation_serviceName_memberUsername_key";

-- AlterTable
ALTER TABLE "ServiceAssociation" DROP COLUMN "memberUsername",
DROP COLUMN "serviceName",
ADD COLUMN     "memberId" INTEGER NOT NULL,
ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAssociation_serviceId_memberId_key" ON "ServiceAssociation"("serviceId", "memberId");

-- AddForeignKey
ALTER TABLE "ServiceAssociation" ADD CONSTRAINT "ServiceAssociation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssociation" ADD CONSTRAINT "ServiceAssociation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
