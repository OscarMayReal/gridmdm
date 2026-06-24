"use client"
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { usePageContext } from "@/components/pageheader";
import { AppDialog, useStoreCatalog } from "@/components/apps";
import { Input } from "@/components/ui/input";

export default function AppSearchPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const [query, setQuery] = useState("");
    const maxResults = 24;
    const catalog = useStoreCatalog();
    const [tenantApps, setTenantApps] = useState<{ loaded: boolean; data: any[] }>({ loaded: false, data: [] });

    useEffect(() => {
        setAreaTitle("Apps");
        setIcon(SearchIcon);
        setTitle("Search Apps");
        setDescription("Search the app catalog");
    }, [setAreaTitle, setIcon, setTitle, setDescription]);

    useEffect(() => {
        fetch("/api/v1/apps", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then((res) => res.json()).then((data) => {
            setTenantApps({ loaded: true, data });
        });
    }, []);

    const filteredApps = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!catalog.loaded) return [];
        if (!normalizedQuery) return catalog.data;

        return catalog.data.filter((app: any) => {
            const haystack = [
                app.name,
                app.summary,
                app.description,
                app.app_id,
                app.id
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }, [catalog, query]);

    const visibleApps = filteredApps.slice(0, maxResults);

    return (
        <div className="flex flex-col max-w-full max-h-[calc(100vh-153px)] overflow-y-auto">
            <div className="max-w-[1280px] mx-auto px-8 py-8 w-full">
                <div className="flex flex-col gap-3 pb-6">
                    <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">Search</div>
                    <Input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by app name, summary, or id"
                        className="h-11 max-w-2xl bg-white"
                    />
                    <div className="text-sm text-neutral-500">
                        {catalog.loaded
                            ? `${filteredApps.length} result${filteredApps.length === 1 ? "" : "s"}${filteredApps.length > maxResults ? `, showing first ${maxResults}` : ""}`
                            : "Loading catalog..."}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {catalog.loaded && visibleApps.map((app: any) => (
                        <AppDialog
                            key={app.app_id ?? app.id}
                            app={app}
                            acquired={tenantApps.data.some((tenantApp) => tenantApp.appId === (app.app_id ?? app.id))}
                            acquisitionReady={tenantApps.loaded}
                            onAcquired={(acquiredApp) => setTenantApps((current) => ({
                                ...current,
                                data: current.data.some((tenantApp) => tenantApp.appId === acquiredApp.appId)
                                    ? current.data
                                    : [...current.data, acquiredApp]
                            }))}
                        />
                    ))}
                </div>

                {catalog.loaded && filteredApps.length === 0 && (
                    <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                        No apps match “{query}”.
                    </div>
                )}
            </div>
        </div>
    );
}
