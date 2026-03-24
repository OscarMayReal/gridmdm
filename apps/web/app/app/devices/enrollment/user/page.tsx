"use client"
import { usePageContext } from "@/components/pageheader";
import { UserIcon } from "lucide-react";
import { useEffect } from "react";

export default function UserEnrollmentPage() {
    const { setAreaTitle, setIcon } = usePageContext();
    useEffect(() => {
        setAreaTitle("User Enrollment");
        setIcon(UserIcon);
    }, []);
    return <div>
        <p>User Enrollment</p>
    </div>
}
