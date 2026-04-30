"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, LaptopIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState, useContext } from "react";
import { Device } from "@repo/database";
import { GroupsAssignmentsTable } from "@/components/tables/profiles/groupstable";
import { GroupsConditionsTable } from "@/components/tables/profiles/conditionstable";
import { GroupContext } from "../layout";
import { GroupDevicesTable } from "@/components/tables/groups/devicestable";

export default function AllDevicesPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { groupid } = use(params)
    const { group, loaded, refresh } = useContext(GroupContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Devices");
            setIcon(MonitorSmartphoneIcon);
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <div className="p-4">
        <GroupDevicesTable groupId={groupid} />
    </div>
}
