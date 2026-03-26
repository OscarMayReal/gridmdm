"use client"
import { DevicesTable } from "@/components/devicestable";
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
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
            setAreaTitle("Overview");
            setIcon(InfoIcon);
        }
    }, [device]);
    return <div className="p-4">
        Overview
    </div>
}
