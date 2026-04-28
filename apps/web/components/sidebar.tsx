"use client";
import { SidebarMenuButton } from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

export function SidebarItem({ Icon, label, href, equals = false }: { Icon: React.JSX.ElementType, label: string, href: string, equals?: boolean }) {
    const router = useRouter();
    const path = usePathname();
    return <SidebarMenuButton className={(equals ? path === href : path.startsWith(href)) ? "bg-[#6D54E9] text-white hover:bg-[#6D54E9] hover:text-white active:bg-[#4D35C3] active:text-white" : ""} onClick={() => router.push(href)}>
        <Icon />
        {label}
    </SidebarMenuButton>
}