/*
  Warnings:

  - The values [SERVICE,SERVICE_ASSOCIATION] on the enum `EntityTipe` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ServiceAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntityTipe_new" AS ENUM ('PROJECT', 'MEMBER', 'PROJECT_ASSOCIATION');
ALTER TABLE "ActivityRecord" ALTER COLUMN "entity" TYPE "EntityTipe_new" USING ("entity"::text::"EntityTipe_new");
ALTER TYPE "EntityTipe" RENAME TO "EntityTipe_old";
ALTER TYPE "EntityTipe_new" RENAME TO "EntityTipe";
DROP TYPE "EntityTipe_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_memberId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_serviceId_fkey";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "services" TEXT[];

-- DropTable
DROP TABLE "ServiceAssociation";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "users";
