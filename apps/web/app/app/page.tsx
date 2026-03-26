"use client"
import { PageHeader } from "@/components/pageheader";
import { HomeIcon } from "lucide-react";
import { usePageContext } from "@/components/pageheader";
import { useEffect } from "react";

export default function App() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    useEffect(() => {
        setAreaTitle("");
        setIcon(HomeIcon);
        setTitle("Home");
        setDescription("Welcome to Quntem Grid Admin Console");
    }, []);
    return (
        <div>
            <PageHeader />
        </div>
    );
}