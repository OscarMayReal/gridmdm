"use client"
import { DevicesGroupsTable } from "@/components/tables/devices/groupstable";
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";

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
            setAreaTitle("Groups");
            setIcon(GroupIcon);
        }
    }, [device]);
    if (!device.loaded) {
        return null;
    }
    return <div className="p-4">
        <DevicesGroupsTable device={device.data} />
    </div>
}
