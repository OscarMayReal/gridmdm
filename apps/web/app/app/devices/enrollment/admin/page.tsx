"use client"
import { usePageContext } from "@/components/pageheader";
import { DevicesTable } from "@/components/tables/devicestable";
import { CrownIcon } from "lucide-react";
import { useEffect } from "react";

export default function AdminEnrollmentPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("Admin Enrollment");
        setIcon(CrownIcon);
        setTitle("Devices");
        setDescription("Manage all enrolled devices");
    }, []);
    return <div className="p-4">
        <DevicesTable mode="admin" />
    </div>
}
