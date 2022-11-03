/*
  Warnings:

  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('ADMIN', 'STUDENT', 'SUPPORT', 'PROFESSOR', 'EXTERNAL');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "MemberType" NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "lsdEmail" TEXT NOT NULL,
    "secondaryEmail" TEXT,
    "memberType" "MemberType" NOT NULL,
    "lattes" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "hasKey" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_username_key" ON "members"("username");

-- CreateIndex
CREATE UNIQUE INDEX "members_cpf_key" ON "members"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "members_rg_key" ON "members"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "members_passport_key" ON "members"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "members_lsdEmail_key" ON "members"("lsdEmail");

-- CreateIndex
CREATE UNIQUE INDEX "members_secondaryEmail_key" ON "members"("secondaryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "members_lattes_key" ON "members"("lattes");
