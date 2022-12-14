/*
  Warnings:

  - You are about to drop the column `username` on the `ProjectAssociation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,memberId]` on the table `ProjectAssociation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `ProjectAssociation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectAssociation" DROP CONSTRAINT "ProjectAssociation_username_fkey";

-- DropIndex
DROP INDEX "ProjectAssociation_projectId_username_key";

-- AlterTable
ALTER TABLE "ProjectAssociation" DROP COLUMN "username",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAssociation_projectId_memberId_key" ON "ProjectAssociation"("projectId", "memberId");

-- AddForeignKey
ALTER TABLE "ProjectAssociation" ADD CONSTRAINT "ProjectAssociation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
