"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon } from "lucide-react";
import { createContext, useEffect, use, useState } from "react";
import { Device } from "@repo/database";
import { SidebarItem } from "@/components/sidebar";
import { SidebarContent, SidebarGroup, SidebarGroupContent, Sidebar } from "@/components/ui/sidebar";

export const DeviceContext = createContext<{ device: Device | null, loaded: boolean, refresh: () => void }>({
    device: null,
    loaded: false,
    refresh: () => { }
});

export default function AllDevicesPage({ params, children }: { params: Promise<{ deviceid: string }>, children: React.ReactNode }) {
    const { setTitle, setDescription } = usePageContext();
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
            setTitle(device.data.displayName);
            setDescription("Manage this device");
        }
    }, [device]);
    return <DeviceContext.Provider value={{ device: device.data, loaded: device.loaded, refresh: () => setDevice({ data: null, loaded: false }) }}>
        <div className="flex-1 flex flex-row">
            <Sidebar className="static" style={{ backgroundColor: "#f5f5f5" }}>
                <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]">
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            <SidebarItem equals Icon={InfoIcon} label="Overview" href={`/app/devices/device/${deviceid}`} />
                            <SidebarItem equals Icon={GroupIcon} label="Groups" href={`/app/devices/device/${deviceid}/groups`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {/* <SidebarGroup>
                        <SidebarGroupLabel>Information</SidebarGroupLabel>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            <SidebarItem Icon={ClockIcon} label="Command History" href={`/app/devices/device/${deviceid}/info/commands`} />
                            <SidebarItem Icon={MessageSquareIcon} label="App Requests" href={`/app/devices/device/${deviceid}/info/requests`} />
                            <SidebarItem Icon={KeyIcon} label="LAPS Password" href={`/app/devices/device/${deviceid}/info/laps`} />
                        </SidebarGroupContent>
                    </SidebarGroup> */}
                </SidebarContent>
            </Sidebar>
            <div className="flex-1">
                {children}
            </div>
        </div>
    </DeviceContext.Provider>
}
