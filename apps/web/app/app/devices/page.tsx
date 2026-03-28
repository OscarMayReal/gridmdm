"use client"
import { DevicesTable } from "@/components/tables/devicestable";
import { usePageContext } from "@/components/pageheader";
import { MonitorSmartphoneIcon } from "lucide-react";
import { useEffect } from "react";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Devices");
        setIcon(MonitorSmartphoneIcon);
        setTitle("Devices");
        setDescription("Manage all enrolled devices");
    }, []);
    return <div className="p-4">
        <DevicesTable />
    </div>
}
