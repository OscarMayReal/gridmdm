"use client"
import { PoliciesTable } from "@/components/tables/policies/policiestable";
import { usePageContext } from "@/components/pageheader";
import { ListIcon, MonitorSmartphoneIcon, ShieldIcon } from "lucide-react";
import { useEffect } from "react";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Policies");
        setIcon(ShieldIcon);
        setTitle("Policies");
        setDescription("Manage all policies");
    }, []);
    return <div className="p-4">
        <PoliciesTable />
    </div>
}
