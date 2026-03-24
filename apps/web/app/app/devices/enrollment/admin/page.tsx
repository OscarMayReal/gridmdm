"use client"
import { usePageContext } from "@/components/pageheader";
import { CrownIcon } from "lucide-react";
import { useEffect } from "react";

export default function AdminEnrollmentPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    useEffect(() => {
        setAreaTitle("Admin Enrollment");
        setIcon(CrownIcon);
    }, []);
    return <div>
        <p>Admin Enrollment</p>
    </div>
}
