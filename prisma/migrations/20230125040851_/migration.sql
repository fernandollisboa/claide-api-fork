/*
  Warnings:

  - You are about to drop the column `embrapii_code` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "embrapii_code",
ADD COLUMN     "embrapiiCode" TEXT;
