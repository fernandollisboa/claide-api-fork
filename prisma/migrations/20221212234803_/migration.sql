-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('CREATE', 'UPDATE');

-- CreateEnum
CREATE TYPE "EntityTipe" AS ENUM ('PROJECT', 'MEMBER', 'SERVICES', 'SERVICE_ASSOCIATION', 'PROJECT_ASSOCIATION');

-- CreateTable
CREATE TABLE "ActivityRecord" (
    "id" SERIAL NOT NULL,
    "operation" "OperationType" NOT NULL,
    "entity" "EntityTipe" NOT NULL,
    "newValue" TEXT NOT NULL,
    "oldValue" TEXT,
    "idEntity" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityRecord_pkey" PRIMARY KEY ("id")
);
