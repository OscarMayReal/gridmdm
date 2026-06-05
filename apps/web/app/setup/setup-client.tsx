"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "keystone-lib";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SetupClient() {
    const auth = useAuth({ appId: process.env.NEXT_PUBLIC_KEYSTONE_APPID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string });

    useEffect(() => {
        if (auth.data?.user) {
            document.cookie = `keystone_session=${auth.data.sessionId}; path=/; max-age=3600; samesite=lax`;
            // Redirect to the setup flow after the session cookie is set.
            window.location.href = "/setup/postsignin";
        }
    }, [auth]);

    return (
        <div className="flex flex-col items-center justify-center h-[100dvh] w-[100dvw] top-0 left-0 fixed bg-background">
            <h1 className="text-3xl font-medium pb-1">Welcome to Quntem Grid</h1>
            <p className="text-muted-foreground pb-5 max-w-[500px] text-center">
                Get started by acquiring Grid in your KeyStone tenant. Once acquired, go to the apps section of KeyStone and assign yourself to the Grid app. Then come back here and reload the page.
            </p>
            <Link href={process.env.NEXT_PUBLIC_KEYSTONE_ACQUIRE_URL!} target="_blank">
                <Button variant="outline">
                    <SquareArrowOutUpRightIcon />
                    Acquire Grid
                </Button>
            </Link>
        </div>
    );
}
