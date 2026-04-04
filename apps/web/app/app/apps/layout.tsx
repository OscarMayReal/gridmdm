"use client"
import { PageHeader } from "@/components/pageheader";
import { SidebarItem } from "@/components/sidebar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { CrownIcon, KeyIcon, LayoutGridIcon, ListIcon, MessageSquareIcon, MonitorSmartphoneIcon, SearchIcon, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DevicesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div>
            <PageHeader />
            <div className="flex flex-row h-full w-full">
                {!pathname.startsWith("/app/apps/profile/") && <Sidebar className="static" style={{ backgroundColor: "#f5f5f5" }}>
                    <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]">
                        <SidebarGroup>
                            <SidebarGroupLabel>Your Apps</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-[4px]">
                                <SidebarItem Icon={LayoutGridIcon} label="Your Apps" equals href="/app/apps" />
                                <SidebarItem Icon={MessageSquareIcon} label="App Requests" href="/app/apps/requests" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Store</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-[4px]">
                                <SidebarItem Icon={CrownIcon} label="Featured Apps" href="/app/apps/store" />
                                <SidebarItem Icon={SearchIcon} label="Search Apps" href="/app/apps/store/search" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}