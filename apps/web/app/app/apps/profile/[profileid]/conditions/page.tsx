"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, LaptopIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState, useContext } from "react";
import { Device } from "@repo/database";
import { ProfileContext } from "../layout";
import { GroupsAssignmentsTable } from "@/components/tables/profiles/groupstable";

export default function AllDevicesPage({ params }: { params: Promise<{ profileid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { profileid } = use(params)
    const { profile, loaded, refresh } = useContext(ProfileContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Conditions");
            setIcon(ListIcon);
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <div className="p-4">
        <GroupsAssignmentsTable profile={profile} refresh={refresh} />
    </div>
}
