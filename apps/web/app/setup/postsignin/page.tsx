"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldTitle } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Tenant } from "@repo/database";
import { AuthState, ResourcesState, useAuth, useResources } from "keystone-lib";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SetupPage() {
    const auth = useAuth({ appId: process.env.NEXT_PUBLIC_KEYSTONE_APPID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string });
    const resources = useResources({ appId: process.env.NEXT_PUBLIC_KEYSTONE_APPID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string });
    const [step, setStep] = useState(1);
    const [gridTenant, setGridTenant] = useState<Tenant | null>(null);
    useEffect(() => {
        fetch("/api/internal/v1/tenant/get", {
            method: "GET",
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
                response.json().then((data: Tenant) => {
                    if (data) {
                        setGridTenant(data)
                        setStep(2)
                    }
                })
            }
        })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center h-[100dvh] w-[100dvw] top-0 left-0 fixed bg-[#f5f5f5]">
            <div className="text-[#666666] fixed top-6 left-1/2 -translate-x-1/2">Step {step}/3</div>
            {step === 1 && <Step1 setStep={setStep} resources={resources} auth={auth} gridTenant={gridTenant} setGridTenant={setGridTenant} />}
            {step === 2 && <Step2 setStep={setStep} gridTenant={gridTenant} setGridTenant={setGridTenant} />}
            {step === 3 && <Step3 setStep={setStep} resources={resources} auth={auth} gridTenant={gridTenant} setGridTenant={setGridTenant} />}
        </div>
    )
}

function Step1({ setStep, resources, auth, gridTenant, setGridTenant }: { setStep: (step: number) => void; resources: ResourcesState; auth: AuthState; gridTenant: Tenant | null; setGridTenant: (tenant: Tenant | null) => void }) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <SparklesIcon className="text-[#666666] mb-1" />
                <CardTitle className="text-[#666666]">Welcome to Quntem Grid</CardTitle>
                <CardDescription className="text-[#666666]">Now you have acquired the Grid App, you can start getting it set up.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => {
                    fetch("/api/internal/v1/tenant/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            domains: resources.data?.domains.map((domain) => domain.name) || []
                        })
                    }).then((response) => {
                        if (response.ok) {
                            response.json().then((data) => {
                                setGridTenant(data)
                                setStep(2)
                            })
                        }
                    })
                }}><ArrowRightIcon />Next</Button>
            </CardFooter>
        </Card>
    )
}

function Step2({ setStep, gridTenant, setGridTenant }: { setStep: (step: number) => void; gridTenant: Tenant | null; setGridTenant: (tenant: Tenant | null) => void }) {
    const [hasSetup, setHasSetup] = useState(false)
    useEffect(() => {
        fetch("/api/internal/v1/tenant/get", {
            method: "GET",
            credentials: "include",
        }).then((response) => {
            if (response.ok) {
                response.json().then((data: Tenant) => {
                    if (data) {
                        setGridTenant(data)
                        setStep(2)
                    }
                })
            }
        })
    }, [])
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <SparklesIcon className="text-[#666666] mb-1" />
                <CardTitle className="text-[#666666]">{gridTenant?.displayName} is now created!</CardTitle>
                <CardDescription className="text-[#666666]">Next, let's set up your MDM Bindings.</CardDescription>
            </CardHeader>
            <ItemGroup className="border-1 rounded-md mx-6">
                <Item>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">1. Open KeyStone</ItemTitle>
                        <ItemDescription className="w-full">Open the Keystone dashboard and navigate to the MDM section</ItemDescription>
                    </ItemContent>
                </Item>
                <Separator />
                <Item>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">2. Bind your MDM</ItemTitle>
                        <ItemDescription className="w-full mb-1">Click "Add MDM Server" and enter the details for your MDM, then click "add"</ItemDescription>
                        <div className="text-[#666666]">name: <code className="text-[#666666] p-1 bg-[#f5f5f5] ml-1 rounded-md">[Whatever you want]</code></div>
                        <div className="text-[#666666]">URL: <code className="text-[#666666] p-1 bg-[#f5f5f5] ml-1 rounded-md">https://grid.quntem.co.uk</code></div>
                        <div className="text-[#666666]">Enrollment Token: <code className="text-[#666666] p-1 bg-[#f5f5f5] ml-1 rounded-md">{gridTenant?.enrollmentToken}</code></div>
                        <div className="text-[#666666]">Is Default: <code className="text-[#666666] p-1 bg-[#f5f5f5] ml-1 rounded-md">Required for self-enrollment</code></div>
                    </ItemContent>
                </Item>
            </ItemGroup>
            <div className="flex flex-row items-center mx-6 gap-3">
                <Checkbox onCheckedChange={(e) => setHasSetup(e as boolean)} checked={hasSetup} />
                <FieldTitle className="text-[#666666]">I see the MDM server in the list</FieldTitle>
            </div>
            <CardFooter>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => setStep(3)} disabled={!hasSetup}><ArrowRightIcon />Next</Button>
            </CardFooter>
        </Card>
    )
}

function Step3({ setStep, resources, auth, gridTenant, setGridTenant }: { setStep: (step: number) => void; resources: ResourcesState; auth: AuthState; gridTenant: Tenant | null; setGridTenant: (tenant: Tenant | null) => void }) {
    const router = useRouter();
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <SparklesIcon className="text-[#666666] mb-1" />
                <CardTitle className="text-[#666666]">You're all set!</CardTitle>
                <CardDescription className="text-[#666666]">Visit the <a href="https://documentation.quntem.co.uk/grid/introduction" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">documentation</a> to learn more about how to use Grid.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => {
                    router.push("/app")
                }}><SparklesIcon />Get Started</Button>
            </CardFooter>
        </Card>
    )
}