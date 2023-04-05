-- AddForeignKey
ALTER TABLE "RegistrationStatus" ADD CONSTRAINT "RegistrationStatus_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "members"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
