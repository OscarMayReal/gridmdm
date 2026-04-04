-- AddForeignKey
ALTER TABLE "app_policy_assignments" ADD CONSTRAINT "app_policy_assignments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "keystone_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
