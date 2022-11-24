/*
  Warnings:

  - The primary key for the `ProjectAssociation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[projectId,username]` on the table `ProjectAssociation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProjectAssociation" DROP CONSTRAINT "ProjectAssociation_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProjectAssociation_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAssociation_projectId_username_key" ON "ProjectAssociation"("projectId", "username");

-- AddForeignKey
ALTER TABLE "ProjectAssociation" ADD CONSTRAINT "ProjectAssociation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssociation" ADD CONSTRAINT "ProjectAssociation_username_fkey" FOREIGN KEY ("username") REFERENCES "members"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
