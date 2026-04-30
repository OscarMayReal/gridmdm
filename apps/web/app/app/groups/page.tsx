"use client"
import { ProfilesTable } from "@/components/tables/profiles/profilestable";
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect } from "react";
import { GroupsTable } from "@/components/tables/groups/groupstable";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Groups");
        setIcon(GroupIcon);
        setTitle("Groups");
        setDescription("Manage all device groups");
    }, []);
    return <div className="p-4">
        <GroupsTable />
    </div>
}
