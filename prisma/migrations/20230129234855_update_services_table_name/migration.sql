/*
  Warnings:

  - The values [SERVICES] on the enum `EntityTipe` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntityTipe_new" AS ENUM ('PROJECT', 'MEMBER', 'SERVICE', 'SERVICE_ASSOCIATION', 'PROJECT_ASSOCIATION');
ALTER TABLE "ActivityRecord" ALTER COLUMN "entity" TYPE "EntityTipe_new" USING ("entity"::text::"EntityTipe_new");
ALTER TYPE "EntityTipe" RENAME TO "EntityTipe_old";
ALTER TYPE "EntityTipe_new" RENAME TO "EntityTipe";
DROP TYPE "EntityTipe_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ServiceAssociation" DROP CONSTRAINT "ServiceAssociation_serviceId_fkey";

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "roomName" DROP NOT NULL;

-- DropTable
DROP TABLE "Services";

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- AddForeignKey
ALTER TABLE "ServiceAssociation" ADD CONSTRAINT "ServiceAssociation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
