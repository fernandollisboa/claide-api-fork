/*
  Warnings:

  - The values [ADMIN] on the enum `MemberType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ServiceAssociation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `entity` on the `ActivityRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PROJECT', 'MEMBER', 'PROJECT_ASSOCIATION');

-- AlterEnum
BEGIN;
CREATE TYPE "MemberType_new" AS ENUM ('STUDENT', 'SUPPORT', 'PROFESSOR', 'EXTERNAL');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "MemberType_new" USING ("role"::text::"MemberType_new");
ALTER TABLE "members" ALTER COLUMN "memberType" TYPE "MemberType_new" USING ("memberType"::text::"MemberType_new");
ALTER TYPE "MemberType" RENAME TO "MemberType_old";
ALTER TYPE "MemberType_new" RENAME TO "MemberType";
DROP TYPE "MemberType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_memberId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_serviceId_fkey";

-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "entity",
ADD COLUMN     "entity" "EntityType" NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "ServiceAssociation" TEXT[];

-- DropTable
DROP TABLE "ServiceAssociation";

-- DropTable
DROP TABLE "services";

-- DropEnum
DROP TYPE "EntityTipe";

-- DropEnum
DROP TYPE "Role";
