"use client"
import { createContext, useContext, useState } from "react";

const PageContext = createContext({
    areaTitle: "",
    setAreaTitle: (areaTitle: string) => { },
    Icon: null as React.JSX.ElementType | null,
    setIcon: (Icon: React.JSX.ElementType) => { },
});

export function usePageContext() {
    return useContext(PageContext);
}

export function PageHeader({ title, description }: { title: string, description: string }) {
    const { areaTitle, Icon } = usePageContext();
    // return <div className="flex flex-col gap-[2px] p-[20px] border-b-1 border-b-[#e4e4e7] bg-white">
    return <div className="flex flex-col gap-[2px] p-[20px] border-b-1 border-b-[#e4e4e7]">
        {/* <p className="text-[16px] text-[#999999] pb-[2px]">{title}</p> */}
        <div className="flex flex-row items-center">
            {Icon && <Icon size={22} className="mr-[10px]" />}
            <h1 className="text-[24px] font-medium">{title} {areaTitle && "• " + areaTitle}</h1>
        </div>
        <p className="text-[16px] text-[#666666]">{description}</p>
    </div>
}

export function PageContextProvider({ children }: { children: React.ReactNode }) {
    const [areaTitle, setAreaTitle] = useState("");
    const [Icon, setIcon] = useState<React.JSX.ElementType | null>(null);
    return <PageContext.Provider value={{ areaTitle, setAreaTitle, Icon, setIcon }}>
        {children}
    </PageContext.Provider>
}
