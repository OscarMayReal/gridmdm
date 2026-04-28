"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";

export default function AllDevicesPage({ params }: { params: Promise<{ policyid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { policyid } = use(params)
    const [policy, setPolicy] = useState<{ data: Device, loaded: boolean }>({ data: null, loaded: false });
    useEffect(() => {
        if (!policy.loaded) {
            fetch(`/api/v1/apps/policy/${policyid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setPolicy({ data, loaded: true });
            });
        }
    }, [policy.loaded]);
    useEffect(() => {
        if (policy.loaded) {
            setAreaTitle("Overview");
            setIcon(InfoIcon);
        }
    }, [policy]);
    return <div className="p-4">
        Overview
    </div>
}
