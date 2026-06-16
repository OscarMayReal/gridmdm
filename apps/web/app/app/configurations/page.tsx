"use client"
import { usePageContext } from "@/components/pageheader";
import { ConfigurationsTable } from "@/components/tables/configurations/configurationstable";
import { ListIcon } from "lucide-react";
import { useEffect } from "react";

export default function ConfigurationsPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("All Configurations");
        setTitle("Configurations");
        setDescription("Create reusable configurations for profiles");
        setIcon(ListIcon);
    }, []);
    return <div className="p-4">
        <ConfigurationsTable />
    </div>
}
