-- CreateTable
CREATE TABLE "ProjectAssociation" (
    "projectId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "ProjectAssociation_pkey" PRIMARY KEY ("projectId")
);
