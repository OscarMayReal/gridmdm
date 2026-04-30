"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, LaptopIcon, ListIcon, MonitorSmartphoneIcon, ShieldIcon } from "lucide-react";
import { useEffect, use, useState, useContext } from "react";
import { Device } from "@repo/database";
import { GroupsAssignmentsTable } from "@/components/tables/profiles/groupstable";
import { GroupsConditionsTable } from "@/components/tables/profiles/conditionstable";
import { GroupContext } from "../layout";
import { GroupDevicesTable } from "@/components/tables/groups/devicestable";
import { GroupPoliciesTable } from "@/components/tables/groups/policiestable";

export default function AllDevicesPage({ params }: { params: Promise<{ groupid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { groupid } = use(params)
    const { group, loaded, refresh } = useContext(GroupContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Policies");
            setIcon(ShieldIcon);
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <div className="p-4">
        <GroupPoliciesTable groupId={groupid} />
    </div>
}
