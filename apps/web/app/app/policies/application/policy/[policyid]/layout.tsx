"use client"
import { usePageContext } from "@/components/pageheader";
import { GroupIcon, InfoIcon, ListIcon, ShieldIcon } from "lucide-react";
import { createContext, useEffect, use, useState } from "react";
import { AppPolicy } from "@repo/database";
import { SidebarItem } from "@/components/sidebar";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, Sidebar } from "@/components/ui/sidebar";

export const AppPolicyContext = createContext<{ policy: AppPolicy | null, loaded: boolean, setPolicy: (policy: AppPolicy) => void, refresh: () => void }>({
    policy: null,
    loaded: false,
    setPolicy: () => { },
    refresh: () => { }
});

export default function AllDevicesPage({ params, children }: { params: Promise<{ policyid: string }>, children: React.ReactNode }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { policyid } = use(params)
    const [policy, setPolicy] = useState<{ data: AppPolicy, loaded: boolean }>({ data: null, loaded: false });
    useEffect(() => {
        if (!policy.loaded) {
            fetch(`/api/v1/apps/policy/${policyid}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setPolicy({ data, loaded: true });
            });
        }
    }, [policy.loaded]);
    useEffect(() => {
        if (policy.loaded) {
            console.log(policy.data);
            setTitle(policy.data.name);
            setDescription("Manage this policy");
        }
    }, [policy]);
    return <AppPolicyContext.Provider value={{ policy: policy.data, loaded: policy.loaded, setPolicy: (policy: Policy) => setPolicy({ data: policy, loaded: true }), refresh: () => setPolicy({ data: null, loaded: false }) }}>
        <div className="flex-1 flex flex-row max-h-[100%]">
            <Sidebar className="static" style={{ backgroundColor: "#f5f5f5" }}>
                <SidebarContent className="bg-[#f5f5f5] p-2 flex flex-col gap-[0px]">
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            <SidebarItem equals Icon={InfoIcon} label="Overview" href={`/app/policies/application/policy/${policyid}`} />
                            <SidebarItem equals Icon={ListIcon} label="Blocks" href={`/app/policies/application/policy/${policyid}/blocks`} />
                            <SidebarItem equals Icon={GroupIcon} label="Assignments" href={`/app/policies/application/policy/${policyid}/assignments`} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <div className="flex-1 max-h-[100%]">
                {children}
            </div>
        </div>
    </AppPolicyContext.Provider>
}
