"use client"
import { ProfilesTable } from "@/components/tables/profiles/profilestable";
import { usePageContext } from "@/components/pageheader";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CrownIcon, LayoutGridIcon, ListIcon, MonitorSmartphoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { AppDialog, AppItem, useAppsOfTheWeek, useCatagories, useCategory, useTrendingApps } from "@/components/apps";

export default function AllDevicesPage() {
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const appsOfTheWeek = useAppsOfTheWeek();
    const categories = useCatagories();
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
    return <div className="flex flex-col max-w-full max-h-[calc(100vh-153px)] overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-8 w-full">
            <div className="flex flex-row items-center gap-2 py-8">
                <img src="/flathub.svg" className="h-7" alt="Flathub" />
            </div>
            <Carousel opts={{
                loop: true,
            }} className="max-w-[1280px] w-full mx-auto">
                <CarouselContent>
                    {appsOfTheWeek.loaded && appsOfTheWeek.apps.map((app) => (
                        <CarouselItem key={app.app.id}>
                            <div className={`max-h-[352px] w-full h-[352px] rounded-lg overflow-hidden p-0 m-0 flex flex-row`} style={{ backgroundColor: app.app.branding[0].value }}>
                                <div className="h-[352px] w-full flex flex-col items-center justify-center gap-2">
                                    <img src={app.app.icons[0].url} alt={app.app.name} />
                                    <div className="flex flex-col">
                                        <h1 className="text-2xl font-bold text-black text-center">{app.app.name}</h1>
                                        <p className="text-sm text-black text-center">{app.app.summary}</p>
                                    </div>
                                </div>
                                {width > 1799 ? <img className="rounded-lg" style={{ maxWidth: "800px", height: "fit-content" }} src={app.app.screenshots[0].sizes[0].src} alt={app.app.name} /> : null}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-17" />
                <CarouselNext className="mr-17" />
            </Carousel>
            <TrendingSection />
            {categories.loaded && categories.data.map((category) => (
                <CategorySection key={category} category={category} />
            ))}
            <div className="h-10" />
        </div>
    </div>
}

function TrendingSection() {
    const [isShowingAll, setIsShowingAll] = useState(false);
    const trendingApps = useTrendingApps();
    return <>
        <div className="flex flex-row items-center gap-2 pt-8 pb-4">
            <h1 className="text-xl font-bold text-black">Trending Apps</h1>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setIsShowingAll(!isShowingAll)}>{isShowingAll ? "Show Less" : "View All"}<ArrowDownIcon /></Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
            {trendingApps.loaded && trendingApps.data.hits.slice(0, isShowingAll ? trendingApps.data.hits.length : 8).map((app) => (
                <AppDialog key={app.id} app={app} />
            ))}
        </div>
    </>
}

function CategorySection({ category }: { category: string }) {
    const [isShowingAll, setIsShowingAll] = useState(false);
    const categoryApps = useCategory({ category });
    return <>
        <div className="flex flex-row items-center gap-2 pt-8 pb-4">
            <h1 className="text-xl font-bold text-black">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setIsShowingAll(!isShowingAll)}>{isShowingAll ? "Show Less" : "View All"}<ArrowDownIcon /></Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
            {categoryApps.loaded && categoryApps.data.hits.slice(0, isShowingAll ? categoryApps.data.hits.length : 8).map((app) => (
                <AppDialog key={app.id} app={app} />
            ))}
        </div>
    </>
}