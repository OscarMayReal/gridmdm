"use client"
import { SidebarProvider, Sidebar, SidebarRail, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeftIcon, GroupIcon, HomeIcon, ListIcon, MonitorSmartphoneIcon, SettingsIcon, ShieldIcon, ShoppingBasketIcon, SidebarIcon } from "lucide-react";
import { SidebarItem } from "@/components/sidebar";
import { PageContextProvider } from "@/components/pageheader";
import { AuthProvider, useAuthContext } from "@/components/auth";
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { JSX } from "react";
import 'lucide-static/font/lucide.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider><PageContextProvider><div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen flex flex-col bg-[#f5f5f5]">
        <Header />
        <SidebarProvider className="flex-1 flex flex-row relative max-h-[calc(100vh-50px)]">
            <Sidebar className="absolute" collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="flex flex-col gap-[4px]">
                            {/* <SidebarTrigger className="w-full flex flex-row justify-end p-[8px] mb-[4px]">
                                <ArrowLeftIcon />
                            </SidebarTrigger> */}
                            <SidebarItem equals Icon={HomeIcon} label="Home" href="/app" />
                            <SidebarItem Icon={MonitorSmartphoneIcon} label="Devices" href="/app/devices" />
                            <SidebarItem Icon={GroupIcon} label="Groups" href="/app/groups" />
                            <SidebarItem Icon={ListIcon} label="Profiles" href="/app/profiles" />
                            <SidebarItem Icon={ShoppingBasketIcon} label="Apps" href="/app/apps" />
                            <SidebarItem Icon={ShieldIcon} label="Policies" href="/app/policies" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <main className="flex-1 max-h-[calc(100vh-50px)]">{children}</main>
        </SidebarProvider>
    </div></PageContextProvider></AuthProvider>;
}

function Header() {
    // const { auth } = useAuthContext();
    return <header className="bg-white border-b-1 border-b-[#e4e4e7] min-h-[50px] flex items-center pl-[16px]">
        <h1 className="text-[16px] font-medium">Quntem Grid Admin Console</h1>
        <div className="flex-1" />
        <HeaderUser />
    </header>
}

function UserItem({ user, Extra, onClick }: { user: any, Extra?: JSX.Element, onClick?: () => void }) {
    return (
        <div className="flex items-center gap-2" onClick={onClick}>
            <Avatar className="border border-[#e4e4e7]" style={{ fontSize: "14px", fontWeight: "400" }}>
                <AvatarFallback style={{ color: "var(--qu-text)" }}>{user.name.charAt(0).toUpperCase() + user.name.charAt(1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-sm color-[var(--qu-text)]">{user.name}</span>
                <span className="truncate opacity-70 text-xs color-[var(--qu-text-secondary)]">{user.email}</span>
            </div>
            {Extra}
        </div>
    );
}

function HeaderUser() {
    const { auth } = useAuthContext();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="header-user-container-outer">
                    <div className="header-user-container">
                        <div className="header-user-text">{auth.data?.user?.name} ({auth.data?.user?.tenant?.name + "/" + auth.data?.user?.username})</div>
                        <div className="header-company-text">{auth.data?.user?.email} ({auth.data?.user?.tenant?.name})</div>
                    </div>
                    <Avatar style={{ width: "30px", height: "30px", marginRight: "10px", border: "1px solid #e4e4e7" }}>
                        <AvatarFallback style={{ color: "var(--qu-text)" }}>{auth.data?.user?.name.charAt(0).toUpperCase() + auth.data?.user?.name.charAt(1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" sideOffset={20} alignOffset={10}>
                <div className="p-2">
                    <UserItem user={auth.data?.user} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="color-[var(--qu-text)]" onClick={() => { LogOut().then(() => { window.location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/signin?redirectTo=" + window.location.href }) }}><LogOutIcon size={20} />Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}