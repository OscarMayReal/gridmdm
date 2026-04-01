"use client"
import { PageHeader } from "@/components/pageheader";
import { SidebarItem } from "@/components/sidebar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { CrownIcon, KeyIcon, LayoutGridIcon, ListIcon, MonitorSmartphoneIcon, ShieldIcon, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DevicesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="max-h-[calc(100vh-50px)] h-[100%] flex flex-col">
            <PageHeader />
            <div className="flex flex-row flex-1 h-[100%]">
                {!pathname.startsWith("/app/policies/policy/") && <Sidebar className="static" style={{ backgroundColor: "#f5f5f5", maxHeight: "100%", height: "100%" }}>
                    <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]" style={{ maxHeight: "100%", height: "100%" }}>
                        <SidebarGroup>
                            <SidebarGroupContent className="flex flex-col gap-[4px]">
                                <SidebarItem equals Icon={ShieldIcon} label="All Policies" href="/app/policies" />
                                <SidebarItem equals Icon={LayoutGridIcon} label="Application Policies" href="/app/policies/application" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>}
                <div className="flex-1 max-h-[100%]">
                    {children}
                </div>
            </div>
        </div>
    );
}