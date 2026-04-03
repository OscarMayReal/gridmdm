"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, EnrolmentProfile } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ListXIcon, PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

export function ProfilesTable() {
    const [profiles, setProfiles] = useState<{ data: EnrolmentProfile[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState([]);
    useEffect(() => {
        if (!profiles.loaded) {
            fetch("/api/v1/profiles", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setProfiles({ data, loaded: true });
            });
        }
    }, [profiles.loaded]);
    const table = useReactTable({
        data: profiles.data,
        state: {
            columnFilters,
        },
        columns: [
            {
                id: "name",
                accessorKey: "name",
                header: "Name",
                filterFn: "includesString"
            },
            {
                header: "Description",
                accessorKey: "description",
            },
            {
                header: "Priority",
                accessorKey: "priority",
            },
            {
                header: "Devices",
                cell: ({ row }) => {
                    return row.original.devices.length;
                },
            },
            {
                header: "Created",
                accessorKey: "createdAt",
                cell: ({ row }) => {
                    return new Date(row.original.createdAt).toLocaleDateString();
                },
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })
    const router = useRouter();
    return (
        <>
            <div className="flex flex-row gap-[10px] pb-[10px]">
                <Filter columnFilterValue={columnFilters} setColumnFilterValue={setColumnFilters} />
                <div className="flex-1" />
                <CreateProfileDialog onCreate={() => {
                    setProfiles({ data: [], loaded: false });
                }} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <ListXIcon />
                    </EmptyMedia>
                    <EmptyTitle>No profiles found</EmptyTitle>
                    <EmptyDescription>Profiles are used to configure devices. Create a new profile to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/profiles/profile/${row.original.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}

function CreateProfileDialog({ onCreate }: { onCreate: (profile: EnrolmentProfile) => void }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(0);
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Create Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Profile</DialogTitle>
                    <DialogDescription>
                        Profiles are used to configure devices by assigning them a set of groups based on the user who enrolled the device.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldDescription>The name of the profile.</FieldDescription>
                    <FieldContent>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <FieldDescription>The description of the profile. Not visible to end users.</FieldDescription>
                    <FieldContent>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Priority</FieldLabel>
                    <FieldDescription>The priority of the profile. Lower numbers have higher priority.</FieldDescription>
                    <FieldContent>
                        <Input type="number" value={priority} onChange={(e) => setPriority(parseInt(e.target.value))} />
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"><XIcon />Cancel</Button>
                    </DialogClose>
                    <Button variant="default" onClick={() => {
                        fetch("/api/v1/profiles", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                name,
                                description,
                                priority,
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