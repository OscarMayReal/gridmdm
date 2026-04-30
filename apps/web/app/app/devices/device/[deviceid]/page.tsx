"use client"
import { DevicesTable } from "@/components/devicestable";
import { usePageContext } from "@/components/pageheader";
import { InfoIcon, LaptopIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, use, useState } from "react";
import { Device } from "@repo/database";
import { Item, ItemGroup, ItemHeader, ItemTitle, ItemDescription, ItemContent } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";

export default function AllDevicesPage({ params }: { params: Promise<{ deviceid: string }> }) {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
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
            setAreaTitle("Overview");
            setIcon(InfoIcon);
        }
    }, [device]);
    if (!device.loaded) {
        return null
    }
    return <div className="p-4">
        <div className="flex flex-row items-center gap-4 flex-wrap">
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Groups</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {device.data?.groups?.length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>Policies</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {device.data?.groups?.flatMap(group => group.group.policyAssignments).length || 0}
                </div>
            </Item>
            <Item variant={"outline"} className="bg-white flex-1 min-w-[200px]">
                <ItemHeader>
                    <ItemTitle>App Policies</ItemTitle>
                </ItemHeader>
                <div className="text-3xl">
                    {device.data?.groups?.flatMap(group => group.group.appPolicyAssignments).length || 0}
                </div>
            </Item>
        </div>
        <ItemGroup className="bg-white border-1 rounded-md mt-4">
            <Item>
                <ItemContent>
                    <ItemTitle>Enrollment Type</ItemTitle>
                    <ItemDescription className="text-xl">{device.data?.isSelfEnrolled ? "User Enrolled" : "Admin Enrolled"}</ItemDescription>
                </ItemContent>
            </Item>
            <Separator/>
            <Item>
                <ItemContent>
                    <ItemTitle>Enrollment Date</ItemTitle>
                    <ItemDescription className="text-xl">{device.data?.enrolledAt ? new Date(device.data.enrolledAt).toLocaleDateString() : "N/A"}</ItemDescription>
                </ItemContent>
            </Item>
            <Separator/>
            <Item>
                <ItemContent>
                    <ItemTitle>OS Version</ItemTitle>
                    <ItemDescription className="text-xl">{device.data?.osVersion}</ItemDescription>
                </ItemContent>
            </Item>
            <Separator/>
            <Item>
                <ItemContent>
                    <ItemTitle>Assigned User</ItemTitle>
                    <ItemDescription className="text-xl">{device.data?.assignedUserId ? device.data.user?.name : "Not Assigned"}</ItemDescription>
                </ItemContent>
            </Item>
        </ItemGroup>
    </div>
}
