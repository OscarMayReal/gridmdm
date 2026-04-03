"use client"
import { DevicesTable } from "@/components/devicestable";
import { usePageContext } from "@/components/pageheader";
import { ClockIcon, CrownIcon, GroupIcon, InfoIcon, KeyIcon, LaptopIcon, LayoutGridIcon, ListIcon, MessageSquareIcon, MonitorSmartphoneIcon, ShieldIcon, UserIcon } from "lucide-react";
import { createContext, useEffect, use, useState } from "react";
import { Device, EnrolmentProfile } from "@repo/database";
import { SidebarItem } from "@/components/sidebar";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, Sidebar } from "@/components/ui/sidebar";

export const ProfileContext = createContext<{ profile: EnrolmentProfile | null, loaded: boolean, refresh: () => void }>({
    profile: null,
    loaded: false,
    refresh: () => { }
});

export default function AllDevicesPage({ params, children }: { params: Promise<{ profileid: string }>, children: React.ReactNode }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { profileid } = use(params)
    const [profile, setProfile] = useState<{ data: EnrolmentProfile, loaded: boolean }>({ data: null, loaded: false });
    useEffect(() => {
        if (!profile.loaded) {
            fetch(`/api/v1/profiles/${profileid}`, {
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
            setDescription("Manage this profile");
        }
    }, [profile]);
    return <ProfileContext.Provider value={{ profile: profile.data, loaded: profile.loaded, refresh: () => setProfile({ data: null, loaded: false }) }}>
        <div className="flex-1 flex flex-row">
            <Sidebar className="static" style={{ backgroundColor: "#f5f5f5" }}>
                <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]">
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            <SidebarItem equals Icon={InfoIcon} label="Overview" href={`/app/profiles/profile/${profileid}`} />
                            <SidebarItem equals Icon={ListIcon} label="Conditions" href={`/app/profiles/profile/${profileid}/conditions`} />
                            <SidebarItem equals Icon={GroupIcon} label="Assignments" href={`/app/profiles/profile/${profileid}/assignments`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div className="flex-1">
                {children}
            </div>
        </div>
    </ProfileContext.Provider>
}
