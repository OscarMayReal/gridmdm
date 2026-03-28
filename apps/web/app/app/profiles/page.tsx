"use client"
import { ProfilesTable } from "@/components/tables/profilestable";
import { usePageContext } from "@/components/pageheader";
import { ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect } from "react";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Profiles");
        setIcon(ListIcon);
        setTitle("Profiles");
        setDescription("Manage all device profiles");
    }, []);
    return <div className="p-4">
        <ProfilesTable />
    </div>
}
