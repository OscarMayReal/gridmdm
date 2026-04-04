"use client"
import { ProfilesTable } from "@/components/tables/profiles/profilestable";
import { usePageContext } from "@/components/pageheader";
import { LayoutGridIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect } from "react";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("Apps");
        setIcon(LayoutGridIcon);
        setTitle("Your Apps");
        setDescription("Manage and deploy your apps");
    }, []);
    return <div className="p-4">
        <ProfilesTable />
    </div>
}
