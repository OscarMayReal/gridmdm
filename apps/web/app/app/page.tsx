"use client"
import { PageHeader } from "@/components/pageheader";
import { HomeIcon } from "lucide-react";
import { usePageContext } from "@/components/pageheader";
import { useEffect } from "react";

export default function App() {
    const { setAreaTitle, setIcon } = usePageContext();
    useEffect(() => {
        setAreaTitle("");
        setIcon(HomeIcon);
    }, []);
    return (
        <div>
            <PageHeader title="Home" description="Welcome to Quntem Grid Admin Console" />
        </div>
    );
}