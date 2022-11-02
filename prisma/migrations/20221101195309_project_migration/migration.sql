-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('PROFESSOR', 'STUDENT', 'PROFISSIONAL', 'EXTERNAL');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "building" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "embrapii_code" TEXT NOT NULL,
    "financier" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_embrapii_code_key" ON "Project"("embrapii_code");
