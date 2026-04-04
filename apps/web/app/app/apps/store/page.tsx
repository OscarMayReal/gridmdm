"use client"
import { ProfilesTable } from "@/components/tables/profiles/profilestable";
import { usePageContext } from "@/components/pageheader";
import { CrownIcon, LayoutGridIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useWindowSize } from "@uidotdev/usehooks";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const appsOfTheWeek = useAppsOfTheWeek();
    useEffect(() => {
        console.log(appsOfTheWeek);
    }, [appsOfTheWeek]);
    useEffect(() => {
        setAreaTitle("Apps");
        setIcon(CrownIcon);
        setTitle("Featured Apps");
        setDescription("Browse and install apps from the store");
    }, []);
    const { width } = useWindowSize();
    return <div className="flex flex-col max-w-full">
        <div className="max-w-[1280px] mx-auto px-15 w-full">
            <div className="flex flex-row items-center gap-2 py-8">
                <img src="/flathub.svg" className="h-7" alt="Flathub" />
            </div>
            <Carousel opts={{
                loop: true,
            }} className="max-w-[1280px] w-full mx-auto">
                <CarouselContent>
                    {appsOfTheWeek.loaded && appsOfTheWeek.apps.map((app) => (
                        <CarouselItem key={app.aotw.id}>
                            <div className={`max-h-[352px] w-full h-[352px] rounded-lg overflow-hidden p-0 m-0 flex flex-row`} style={{ backgroundColor: app.app.branding[0].value }}>
                                <div className="h-[352px] w-full flex flex-col items-center justify-center gap-2">
                                    <img src={app.app.icons[0].url} alt={app.app.name} />
                                    <div className="flex flex-col">
                                        <h1 className="text-2xl font-bold text-black text-center">{app.app.name}</h1>
                                        <p className="text-sm text-black text-center">{app.app.summary}</p>
                                    </div>
                                </div>
                                {width > 1899 ? <img className="rounded-lg" style={{ maxWidth: "800px", height: "fit-content" }} src={app.app.screenshots[0].sizes[0].src} alt={app.app.name} /> : null}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-17" />
                <CarouselNext className="mr-17" />
            </Carousel>
        </div>
    </div>
}

function useAppsOfTheWeek() {
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

function useAppById(id: string) {
    const [app, setApp] = useState({ loaded: false, app: null });
    useEffect(() => {
        fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json()).then((data) => {
            setApp({ loaded: true, app: data });
        });
    }, [id]);
    return app;
}

function getAppById(id: string) {
    return fetch("/api/v1/flathubproxy/appstream/" + id).then((res) => res.json());
}