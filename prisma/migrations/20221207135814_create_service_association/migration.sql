-- CreateTable
CREATE TABLE "ServiceAssociation" (
    "id" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "memberUsername" TEXT NOT NULL,

    CONSTRAINT "ServiceAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAssociation_serviceName_memberUsername_key" ON "ServiceAssociation"("serviceName", "memberUsername");

-- AddForeignKey
ALTER TABLE "ServiceAssociation" ADD CONSTRAINT "ServiceAssociation_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Services"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssociation" ADD CONSTRAINT "ServiceAssociation_memberUsername_fkey" FOREIGN KEY ("memberUsername") REFERENCES "members"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
