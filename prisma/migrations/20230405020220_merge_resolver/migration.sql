/*
  Warnings:

  - You are about to drop the column `serviceAssociation` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "serviceAssociation",
ADD COLUMN     "services" TEXT[];

-- DropTable
DROP TABLE "users";
