"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState, useContext } from "react";
import { Device } from "@repo/database";
import { ProfileContext } from "./layout";

export default function AllDevicesPage({ params }: { params: Promise<{ profileid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { profileid } = use(params)
    const { profile, loaded, refresh } = useContext(ProfileContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Overview");
            setIcon(InfoIcon);
        }
    }, [loaded]);
    return <div className="p-4">
        Overview
    </div>
}
