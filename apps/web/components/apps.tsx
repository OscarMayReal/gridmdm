"use client"
import { useState, useEffect } from "react";
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog, DialogClose, DialogFooter } from "./ui/dialog";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "./ui/item";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

export function AppItem({ app, onClick }: { app: any, onClick: () => void }) {
    return <Item variant={"outline"} className="bg-white hover:cursor-pointer hover:bg-neutral-50" onClick={onClick}>
        <ItemMedia>
            <img src={app.icon} style={{ width: "64px", height: "64px" }} alt={app.name} />
        </ItemMedia>
        <ItemContent>
            <ItemTitle>{app.name}</ItemTitle>
            <ItemDescription>{app.summary}</ItemDescription>
        </ItemContent>
    </Item>
}

export function AppDialog({ app, acquired = false, acquisitionReady = true, onAcquired }: { app: any, acquired?: boolean, acquisitionReady?: boolean, onAcquired?: (app: any) => void }) {
    const [open, setOpen] = useState(false);
    if (open) {
        console.log(app);
    }
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <AppItem onClick={() => setOpen(true)} app={app} />
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] h-[90vh] w-[90vw] min-w-[90vw] min-h-[90vh] gap-0 p-0 flex flex-col">
            <DialogHeader className="p-6 h-[90px] flex flex-row items-center gap-3">
                <img src={app.icon} style={{ width: "40px", height: "40px" }} alt={app.name} />
                <div className="flex flex-col gap-1">
                    <DialogTitle>{app.name}</DialogTitle>
                    <DialogDescription>
                        {app.summary}
                    </DialogDescription>
                </div>
            </DialogHeader>
            <Separator />
            {open && <AppDialogContent appId={app.app_id} acquired={acquired} acquisitionReady={acquisitionReady} onAcquired={onAcquired} />}
        </DialogContent>
    </Dialog>
}

function AppDialogContent({ appId, acquired, acquisitionReady, onAcquired }: { appId: string, acquired: boolean, acquisitionReady: boolean, onAcquired?: (app: any) => void }) {
    const app = useAppById(appId);
    const [isAcquired, setIsAcquired] = useState(acquired);

    useEffect(() => {
        setIsAcquired(acquired);
    }, [acquired]);

    if (!app.loaded || !app.app) return null;
    return <div className="max-h-full overflow-y-auto">
        <div className="flex flex-row gap-3 max-w-full overflow-x-auto p-6 pb-0 pt-6 h-fit">
            <Button
                disabled={!acquisitionReady || isAcquired}
                onClick={() => {
                    if (!acquisitionReady || isAcquired) return;
                    console.log(app.app);
                    fetch("/api/v1/apps/acquireapp", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            appId: app.app.id,
                            name: app.app.name,
                            description: app.app.summary,
                            version: app.app.version,
                        }),
                        credentials: "include"
                    }).then(async (response) => {
                        const createdApp = await response.json();
                        setIsAcquired(true);
                        onAcquired?.(createdApp);
                    });
                }}
            >
                {isAcquired ? <CheckIcon /> : <PlusIcon />}
                {isAcquired ? "Acquired" : "Acquire"}
            </Button>
        </div>
        <div className="px-6 pb-3 pt-6 text-lg font-medium text-[#999999]">
            Description
        </div>
        <div className="px-6 pb-6 text-md font-regular text-[#666666]" dangerouslySetInnerHTML={{ __html: app.app.description }} />
        <div className="px-6 pb-3 text-lg font-medium text-[#999999]">
            Screenshots
        </div>
        {app.loaded && <div className="flex flex-row gap-3 max-w-full overflow-x-auto p-6 pt-0 h-fit">
            {app.app.screenshots && app.app.screenshots.length > 0 ? app.app.screenshots.map((screenshot: any) => (
                <img src={screenshot.sizes[0].src} className="max-h-[450px] min-h-[450px] h-[450px] w-fit" />
            )) : <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-lg font-medium text-[#666666]">No screenshots available</p>
            </div>}
        </div>}
    </div>
}

export function useAppsOfTheWeek() {
    const [appsOfTheWeek, setAppsOfTheWeek] = useState<{ loaded: boolean; apps: { aotw: any; app: any }[] }>({ loaded: false, apps: [] });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/app-picks/apps-of-the-week/" + new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getDate().toString().padStart(2, "0")).then((res) => res.json()).then(async (data) => {
            const apps = [];
            for (const app of data.apps) {
                apps.push({ aotw: app, app: await getAppById(app.app_id) });
            }
            setAppsOfTheWeek({ loaded: true, apps: apps });
        });
    }, []);
    return appsOfTheWeek;
}

export function useAppById(id: string) {
    const [app, setApp] = useState<{ loaded: boolean; app: any | null }>({ loaded: false, app: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json()).then((data) => {
            setApp({ loaded: true, app: data });
        });
    }, [id]);
    return app;
}

export function useTrendingApps() {
    const [app, setApp] = useState<{ loaded: boolean; data: any | null }>({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/trending").then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function useCategory({ category }: { category: string }) {
    const [app, setApp] = useState<{ loaded: boolean; data: any | null }>({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/category/" + category).then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function useCatagories() {
    const [app, setApp] = useState<{ loaded: boolean; data: string[] | null }>({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/category").then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function useTenantApps() {
    const [apps, setApps] = useState<{ loaded: boolean; data: any[] }>({ loaded: false, data: [] });
    useEffect(() => {
        fetch("/api/v1/apps", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then((res) => res.json()).then((data) => {
            setApps({ loaded: true, data });
        });
    }, []);
    return apps;
}

export function getAppById(id: string) {
    return fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json());
}
