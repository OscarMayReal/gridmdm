"use client"
import { GenericTable } from "@/components/generictable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { ListIcon, PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const configurationTypes = ["DCONF", "FILE", "EXEC", "SYSTEMD", "LAPS", "ALLOWED_APPS"];

export function ConfigurationsTable() {
    const [configurations, setConfigurations] = useState<{ data: any[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState<any[]>([]);
    useEffect(() => {
        if (!configurations.loaded) {
            fetch("/api/v1/configurations", {
                credentials: "include"
            }).then(res => res.json()).then(data => setConfigurations({ data, loaded: true }));
        }
    }, [configurations.loaded]);

    const table = useReactTable({
        data: configurations.data,
        state: { columnFilters },
        columns: [
            { id: "name", header: "Name", accessorKey: "name", filterFn: "includesString" },
            { id: "type", header: "Type", accessorKey: "type" },
            { id: "description", header: "Description", accessorKey: "description" },
            { id: "profiles", header: "Profiles", cell: ({ row }) => row.original.profiles?.length || 0 },
            { id: "createdAt", header: "Created", accessorKey: "createdAt", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    const router = useRouter();

    return (
        <>
            <div className="flex flex-row gap-[10px] pb-[10px]">
                <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilters.find((filter) => filter.id === "name")?.value || ""} onChange={(e) => setColumnFilters([{ id: "name", value: e.target.value }])} />
                <div className="flex-1" />
                <CreateConfigurationDialog onCreate={() => setConfigurations({ data: [], loaded: false })} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon"><ListIcon /></EmptyMedia>
                    <EmptyTitle>No configurations found</EmptyTitle>
                    <EmptyDescription>Create a reusable configuration to add to profiles.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/configurations/${row.original.id}`)} />
            </div>
        </>
    )
}

function CreateConfigurationDialog({ onCreate }: { onCreate: () => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("DCONF");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon />Create Configuration</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Configuration</DialogTitle>
                    <DialogDescription>Configurations can be reused by one or more profiles.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldDescription>The name of the configuration.</FieldDescription>
                    <FieldContent><Input value={name} onChange={(event) => setName(event.target.value)} /></FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <FieldDescription>The description of the configuration.</FieldDescription>
                    <FieldContent><Input value={description} onChange={(event) => setDescription(event.target.value)} /></FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Type</FieldLabel>
                    <FieldDescription>The kind of configuration.</FieldDescription>
                    <FieldContent>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {configurationTypes.map((configurationType) => <SelectItem key={configurationType} value={configurationType}>{configurationType}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline"><XIcon />Cancel</Button></DialogClose>
                    <Button onClick={() => {
                        fetch("/api/v1/configurations", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ name, description, type })
                        }).then(() => {
                            setOpen(false);
                            onCreate();
                        })
                    }}><PlusIcon />Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
