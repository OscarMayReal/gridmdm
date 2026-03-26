"use client"
import { usePageContext } from "@/components/pageheader";
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
    return <div>
        <p>Admin Enrollment</p>
    </div>
}
