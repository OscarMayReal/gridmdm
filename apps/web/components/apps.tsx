"use client"
import { useState, useEffect } from "react";
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog } from "./ui/dialog";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "./ui/item";

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

export function AppDialog({ app }: { app: any }) {
    const [open, setOpen] = useState(false);
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <AppItem onClick={() => setOpen(true)} app={app} />
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] h-[90vh] w-[90vw] min-w-[90vw] min-h-[90vh] p-0 flex flex-col">
            <DialogHeader className="p-6 h-[90px] flex flex-row items-center gap-3">
                <img src={app.icon} style={{ width: "40px", height: "40px" }} alt={app.name} />
                <div className="flex flex-col gap-1">
                    <DialogTitle>{app.name}</DialogTitle>
                    <DialogDescription>
                        {app.summary}
                    </DialogDescription>
                </div>
            </DialogHeader>
            {open && <AppDialogContent appId={app.id.replaceAll("_", ".")} />}
        </DialogContent>
    </Dialog>
}

function AppDialogContent({ appId }: { appId: string }) {
    const app = useAppById(appId);
    if (!app.loaded) return null;
    return <div className="flex flex-col">
        <div className="px-6 pb-3 text-lg font-medium text-[#999999]">
            Description
        </div>
        <div className="px-6 pb-6 text-md font-regular text-[#666666]" dangerouslySetInnerHTML={{ __html: app.app.description }} />
        <div className="px-6 pb-3 text-lg font-medium text-[#999999]">
            Screenshots
        </div>
        {app.loaded && <div className="flex flex-row gap-3 max-w-full overflow-x-auto p-6 pt-0">
            {app.app.screenshots && app.app.screenshots.length > 0 ? app.app.screenshots.map((screenshot: any) => (
                <img src={screenshot.sizes[0].src} className="max-h-[450px] w-fit" />
            )) : <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-lg font-medium text-[#666666]">No screenshots available</p>
            </div>}
        </div>}
    </div>
}

export function useAppsOfTheWeek() {
    const [appsOfTheWeek, setAppsOfTheWeek] = useState({ loaded: false, apps: [] });
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
    const [app, setApp] = useState({ loaded: false, app: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json()).then((data) => {
            setApp({ loaded: true, app: data });
        });
    }, [id]);
    return app;
}

export function useTrendingApps() {
    const [app, setApp] = useState({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/trending").then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function useCategory({ category }: { category: string }) {
    const [app, setApp] = useState({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/category/" + category).then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function useCatagories() {
    const [app, setApp] = useState({ loaded: false, data: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/collection/category").then((res) => res.json()).then((data) => {
            setApp({ loaded: true, data: data });
        });
    }, []);
    return app;
}

export function getAppById(id: string) {
    return fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json());
}