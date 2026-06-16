"use client"
import { GenericTable } from "@/components/generictable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ListIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ProfileConfigurationsTable({ profile, refresh }: { profile: any, refresh: () => void }) {
    const table = useReactTable({
        data: profile.configurations || [],
        columns: [
            {
                id: "name",
                header: "Name",
                accessorFn: (row: any) => row.configuration?.name,
            },
            {
                id: "type",
                header: "Type",
                accessorFn: (row: any) => row.configuration?.type,
            },
            {
                id: "description",
                header: "Description",
                accessorFn: (row: any) => row.configuration?.description || "",
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <Button variant="outline" size="sm" onClick={(event) => {
                        event.stopPropagation();
                        fetch(`/api/v1/profiles/${profile.id}/configurations/${row.original.id}`, {
                            method: "DELETE",
                            credentials: "include"
                        }).then(() => refresh())
                    }}><TrashIcon />Remove</Button>
                )
            },
        ],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <div className="flex flex-row gap-[10px] pb-[10px]">
                <div className="flex-1" />
                <AddConfigurationDialog profile={profile} refresh={refresh} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <ListIcon />
                    </EmptyMedia>
                    <EmptyTitle>No configurations</EmptyTitle>
                    <EmptyDescription>Add configurations to this profile.</EmptyDescription>
                </Empty>} table={table} />
            </div>
        </>
    )
}

function AddConfigurationDialog({ profile, refresh }: { profile: any, refresh: () => void }) {
    const [open, setOpen] = useState(false);
    const [configurationId, setConfigurationId] = useState("");
    const [configurations, setConfigurations] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            fetch("/api/v1/configurations", {
                credentials: "include"
            }).then(res => res.json()).then(setConfigurations)
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon />Add Configuration</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Configuration</DialogTitle>
                    <DialogDescription>Select a reusable configuration for this profile.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Configuration</FieldLabel>
                    <FieldDescription>The configuration to add.</FieldDescription>
                    <FieldContent>
                        <Select value={configurationId} onValueChange={setConfigurationId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a configuration" />
                            </SelectTrigger>
                            <SelectContent>
                                {configurations.map((configuration) => (
                                    <SelectItem key={configuration.id} value={configuration.id} disabled={profile.configurations?.some((entry: any) => entry.configurationId === configuration.id)}>
                                        {configuration.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"><XIcon />Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => {
                        fetch(`/api/v1/profiles/${profile.id}/configurations`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ configurationId })
                        }).then(() => {
                            setOpen(false);
                            refresh();
                        })
                    }}><PlusIcon />Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
