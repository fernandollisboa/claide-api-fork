-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "RegistrationStatus" (
    "id" SERIAL NOT NULL,
    "status" "StatusType" NOT NULL,
    "comment" TEXT,
    "createdBy" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "RegistrationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationStatus_memberId_key" ON "RegistrationStatus"("memberId");

-- AddForeignKey
ALTER TABLE "RegistrationStatus" ADD CONSTRAINT "RegistrationStatus_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
