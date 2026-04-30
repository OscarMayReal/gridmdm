"use client"
import { DevicesTable } from "@/components/devicestable";
import { usePageContext } from "@/components/pageheader";
import { ClockIcon, CrownIcon, GroupIcon, InfoIcon, KeyIcon, LaptopIcon, LayoutGridIcon, ListIcon, MessageSquareIcon, MonitorSmartphoneIcon, ShieldIcon, UserIcon } from "lucide-react";
import { createContext, useEffect, use, useState } from "react";
import { Device, EnrolmentProfile } from "@repo/database";
import { SidebarItem } from "@/components/sidebar";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, Sidebar } from "@/components/ui/sidebar";

export const GroupContext = createContext<{ group: EnrolmentProfile | null, loaded: boolean, refresh: () => void }>({
    group: null,
    loaded: false,
    refresh: () => { }
});

export default function AllDevicesPage({ params, children }: { params: Promise<{ groupid: string }>, children: React.ReactNode }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { groupid } = use(params)
    const [profile, setProfile] = useState<{ data: EnrolmentProfile, loaded: boolean }>({ data: null, loaded: false });
    useEffect(() => {
        if (!profile.loaded) {
            fetch(`/api/v1/groups/${groupid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setProfile({ data, loaded: true });
            });
        }
    }, [profile.loaded]);
    useEffect(() => {
        if (profile.loaded) {
            setTitle(profile.data.name);
            setDescription("Manage this group");
        }
    }, [profile]);
    return <GroupContext.Provider value={{ group: profile.data, loaded: profile.loaded, refresh: () => setProfile({ data: null, loaded: false }) }}>
        <div className="flex-1 flex flex-row">
            <Sidebar className="static" style={{ backgroundColor: "#f5f5f5" }}>
                <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]">
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            <SidebarItem equals Icon={InfoIcon} label="Overview" href={`/app/groups/group/${groupid}`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Devices</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarItem equals Icon={MonitorSmartphoneIcon} label="Devices" href={`/app/groups/group/${groupid}/devices`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Profiles</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarItem equals Icon={ListIcon} label="Conditions" href={`/app/groups/group/${groupid}/profiles/conditions`} />
                            <SidebarItem equals Icon={GroupIcon} label="Assignments" href={`/app/groups/group/${groupid}/profiles/assignments`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Policies</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarItem equals Icon={ShieldIcon} label="Policies" href={`/app/groups/group/${groupid}/policies`} />
                            <SidebarItem equals Icon={LayoutGridIcon} label="App Policies" href={`/app/groups/group/${groupid}/policies/app-policies`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div className="flex-1">
                {children}
            </div>
        </div>
    </GroupContext.Provider>
}
