"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState, useContext } from "react";
import { Device } from "@repo/database";
import { GroupContext } from "./layout";
import { Item, ItemHeader, ItemTitle } from "@/components/ui/item";

export default function AllDevicesPage({ params }: { params: Promise<{ profileid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const { profileid } = use(params)
    const { group, loaded, refresh } = useContext(GroupContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Overview");
            setIcon(InfoIcon);
        }
    }, [loaded]);
    return <div className="p-4">
        <div className="flex flex-row items-center gap-4 flex-wrap">
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Devices</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {group?.devices?.length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Profile Conditions</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {group?.profileConditions?.length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Profile Assignments</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {group?.profileAssignments?.length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>App Policies</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {group?.appPolicyAssignments?.length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Policies</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {group?.policyAssignments?.length || 0}
                </div>
            </Item>
        </div>
    </div>
}
