"use client"
import { DevicesTable } from "@/components/devicestable";
import { usePageContext } from "@/components/pageheader";
import { MonitorSmartphoneIcon } from "lucide-react";
import { useEffect } from "react";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Devices");
        setIcon(MonitorSmartphoneIcon);
    }, []);
    return <div className="p-6">
        <DevicesTable />
    </div>
}
