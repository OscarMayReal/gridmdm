"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";
import { PolicyContext } from "../layout";
import { useContext } from "react";
import { BlocksEditor } from "@/components/tables/policies/blockseditor";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { policy, loaded } = useContext(PolicyContext)
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Blocks");
            setIcon(InfoIcon);
        }
    }, [loaded]);
    return <div className="p-4 max-h-[calc(100vh-153px)] overflow-y-auto">
        <BlocksEditor />
    </div>
}
