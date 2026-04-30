"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { App, AppPolicy, AppPolicyEntry, Device, EnrolmentProfile, KeyStoneGroup, Policy, PolicyAssignment } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LayoutGridIcon, ListXIcon, PlusCircleIcon, PlusIcon, ShieldXIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";

export function AppPolicyAppsTable({ policy, setPolicy, refresh }: { policy: AppPolicy, setPolicy: (policy: AppPolicy) => void, refresh: () => void }) {
    const [columnFilters, setColumnFilters] = useState([]);
    const table = useReactTable({
        data: policy.apps as AppPolicyEntry&{app: App}[],
        state: {
            columnFilters,
        },
        columns: [
            {
                accessorFn: (row) => row.app?.name,
                header: "App",
            },
            {
                accessorFn: (row) => row.app?.description || "",
                header: "Description",
            },
            {
                accessorFn: (row) => row.rule || "",
                header: "Rule",
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState({state: false, app: null});
    return (
        <>
            <Dialog open={deleteDialogOpen.state} onOpenChange={(open) => setDeleteDialogOpen({state: open, app: deleteDialogOpen.app})}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete App Assignment?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this app assignment? you can re-add it later if needed.
                        </DialogDescription>
                        <DialogFooter>
                            <Button variant="outline"><XIcon />Cancel</Button>
                            <Button variant="destructive" onClick={async () => {
                                await fetch(`/api/v1/apps/policy/${policy.id}/appentry/${deleteDialogOpen.app?.appId}`, {
                                    method: "DELETE",
                                })
                                setDeleteDialogOpen({state: false, app: null});
                                refresh()
                            }}><TrashIcon />Delete</Button>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="flex flex-row gap-[10px] pb-[10px]">
                <Filter columnFilterValue={columnFilters} setColumnFilterValue={setColumnFilters} />
                <CreateAppEntryDialog policy={policy} onCreate={() => {
                    refresh();
                }} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <LayoutGridIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Apps found</EmptyTitle>
                    <EmptyDescription>Apps are used to install apps on devices. Create a new app to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => setDeleteDialogOpen({state: true, app: row.original})} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}

function CreateAppEntryDialog({ policy, onCreate }: { policy: Policy, onCreate: (policy: Policy) => void }) {
    const [appId, setAppId] = useState("");
    const [open, setOpen] = useState(false);
    const [apps, setApps] = useState<KeyStoneGroup[]>([]);
    const [rule, setRule] = useState("");
    useEffect(() => {
        fetch("/api/v1/apps", {
            credentials: "include",
        }).then(res => res.json()).then(data => {
            setApps(data);
        });
    }, []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Create Assignment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                    <DialogDescription>
                        Assignments are used to assign policies to groups.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>App</FieldLabel>
                    <FieldDescription>The app to assign to the policy.</FieldDescription>
                    <FieldContent>
                        <Select value={appId} onValueChange={setAppId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an app" />
                            </SelectTrigger>
                            <SelectContent>
                                {apps.map((app) => (
                                    <SelectItem key={app.id} value={app.id} disabled={policy.apps.some((appEntry) => appEntry.appId === app.id)}>
                                        {app.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Rule</FieldLabel>
                    <FieldDescription>The rule for the app assignment.</FieldDescription>
                    <FieldContent>
                        <Select value={rule} onValueChange={setRule}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a rule" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FORCED">Forced</SelectItem>
                                <SelectItem value="OPTIONAL">Optional</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"><XIcon />Cancel</Button>
                    </DialogClose>
                    <Button variant="default" onClick={() => {
                        fetch("/api/v1/apps/policy/" + policy.id + "/appentry", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                appId,
                                rule,
                            }),
                        }).then(res => res.json()).then(data => {
                            setOpen(false);
                            onCreate(data);
                        });
                    }}><PlusIcon />Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}