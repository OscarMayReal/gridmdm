"use client"
import { PageHeader } from "@/components/pageheader";

export default function ConfigurationsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <PageHeader />
            <div className="flex flex-row h-full w-full">
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
