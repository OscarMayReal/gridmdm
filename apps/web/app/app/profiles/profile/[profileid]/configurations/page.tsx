"use client"
import { usePageContext } from "@/components/pageheader";
import { ListIcon } from "lucide-react";
import { useEffect, useContext } from "react";
import { ProfileContext } from "../layout";
import { ProfileConfigurationsTable } from "@/components/tables/profiles/configurationstable";

export default function ProfileConfigurationsPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    const { profile, loaded, refresh } = useContext(ProfileContext);
    useEffect(() => {
        if (loaded) {
            setAreaTitle("Configurations");
            setIcon(ListIcon);
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <div className="p-4">
        <ProfileConfigurationsTable profile={profile} refresh={refresh} />
    </div>
}
