-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "keystone_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
