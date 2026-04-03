-- AddForeignKey
ALTER TABLE "enrolment_profile_group_assignments" ADD CONSTRAINT "enrolment_profile_group_assignments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "keystone_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
