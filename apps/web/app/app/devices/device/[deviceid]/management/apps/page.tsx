"use client"
import { DevicesGroupsTable } from "@/components/tables/devices/groupstable";
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, LaptopIcon, LayoutGridIcon, MonitorSmartphoneIcon, ShieldIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";
import { DevicesPoliciesTable } from "@/components/tables/devices/policiestable";
import { DevicesAppPoliciesTable } from "@/components/tables/devices/apppoliciestable";

export default function AllDevicesPage({ params }: { params: Promise<{ deviceid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { deviceid } = use(params)
    const [device, setDevice] = useState<{ data: Device, loaded: boolean }>({ data: null, loaded: false });
    useEffect(() => {
        if (!device.loaded) {
            fetch(`/api/v1/devices/${deviceid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setDevice({ data, loaded: true });
            });
        }
    }, [device.loaded]);
    useEffect(() => {
        if (device.loaded) {
            setAreaTitle("App Policies");
            setIcon(LayoutGridIcon);
        }
    }, [device]);
    if (!device.loaded) {
        return null;
    }
    return <div className="p-4">
        <DevicesAppPoliciesTable device={device.data} />
    </div>
}
