"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";
import { AppPolicyContext } from "../layout";
import { useContext } from "react";
import { BlocksEditor } from "@/components/tables/policies/blockseditor";
import { AppPolicyAppsTable } from "@/components/tables/policies/apps/appstable";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { policy, loaded, setPolicy, refresh } = useContext(AppPolicyContext)
    useEffect(() => {
        if (loaded && policy) {
            setAreaTitle("Apps");
            setIcon(InfoIcon);
        }
    }, [loaded, policy]);
    if (!policy) {
        return null;
    }
    return <div className="p-4 max-h-[calc(100vh-153px)] overflow-y-auto">
        <AppPolicyAppsTable policy={policy} setPolicy={setPolicy} refresh={refresh} />
    </div>
}
