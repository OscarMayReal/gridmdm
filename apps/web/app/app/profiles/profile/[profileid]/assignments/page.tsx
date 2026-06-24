"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon } from "lucide-react";
import { useEffect, useContext } from "react";
import { ProfileContext } from "../layout";
import { ProfileAssignmentsTable } from "@/components/tables/profiles/assignmentstable";

export default function ProfileAssignmentsPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    const { profile, loaded, refresh } = useContext(ProfileContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Assignments");
            setIcon(GroupIcon);
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <div className="p-4">
        <ProfileAssignmentsTable profile={profile} refresh={refresh} />
    </div>
}
