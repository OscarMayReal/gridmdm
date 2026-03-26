"use client"
import { createContext, useContext, useState } from "react";

const PageContext = createContext({
    areaTitle: null as string | null,
    setAreaTitle: (areaTitle: string | null) => { },
    Icon: null as React.JSX.ElementType | null,
    setIcon: (Icon: React.JSX.ElementType | null) => { },
    description: null as string | null,
    setDescription: (description: string | null) => { },
    title: null as string | null,
    setTitle: (title: string | null) => { },
});

export function usePageContext() {
    return useContext(PageContext);
}

export function PageHeader() {
    const PageContext = usePageContext();
    // return <div className="flex flex-col gap-[2px] p-[20px] border-b-1 border-b-[#e4e4e7] bg-white">
    return <div className="flex flex-col gap-[2px] p-[20px] border-b-1 border-b-[#e4e4e7]">
        {/* <p className="text-[16px] text-[#999999] pb-[2px]">{title}</p> */}
        <div className="flex flex-row items-center">
            {PageContext.Icon && <PageContext.Icon size={22} className="mr-[10px]" />}
            <h1 className="text-[24px] font-medium">{PageContext.title} {PageContext.areaTitle && "• " + PageContext.areaTitle}</h1>
        </div>
        <p className="text-[16px] text-[#666666]">{PageContext.description}</p>
    </div>
}

export function PageContextProvider({ children }: { children: React.ReactNode }) {
    const [areaTitle, setAreaTitle] = useState<string | null>(null);
    const [Icon, setIcon] = useState<React.JSX.ElementType | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    return <PageContext.Provider value={{ areaTitle, setAreaTitle, Icon, setIcon, description, setDescription, title, setTitle }}>
        {children}
    </PageContext.Provider>
}
