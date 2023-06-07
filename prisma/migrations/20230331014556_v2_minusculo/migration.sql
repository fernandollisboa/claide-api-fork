/*
  Warnings:

  - You are about to drop the column `ServiceAssociation` on the `members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "ServiceAssociation",
ADD COLUMN     "serviceAssociation" TEXT[];
