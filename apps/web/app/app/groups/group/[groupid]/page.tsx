"use client"
import { usePageContext } from "@/components/pageheader";
import { InfoIcon } from "lucide-react";
import { useEffect, useContext } from "react";
import { GroupContext } from "./layout";
import { Item, ItemHeader, ItemTitle } from "@/components/ui/item";

export default function GroupOverviewPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    const { group, loaded } = useContext(GroupContext);
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
        </div>
    </div>
}
