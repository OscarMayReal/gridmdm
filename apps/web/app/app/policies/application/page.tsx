"use client"
import { PoliciesTable } from "@/components/tables/policies/policiestable";
import { usePageContext } from "@/components/pageheader";
import { LayoutGridIcon, ListIcon, MonitorSmartphoneIcon, ShieldIcon } from "lucide-react";
import { useEffect } from "react";
import { AppPoliciesTable } from "@/components/tables/policies/apps/policiestable";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("App Policies");
        setIcon(LayoutGridIcon);
        setTitle("Policies");
        setDescription("Manage all app policies");
    }, []);
    return <div className="p-4">
        <AppPoliciesTable />
    </div>
}
