"use client"
import { usePageContext } from "@/components/pageheader";
import { DevicesTable } from "@/components/tables/devicestable";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";

export default function UserEnrollmentPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("User Enrollment");
        setIcon(UserIcon);
        setTitle("Devices");
        setDescription("Manage all enrolled devices");
    }, []);
    return <div className="p-4">
        <DevicesTable mode="user" />
    </div>
}
