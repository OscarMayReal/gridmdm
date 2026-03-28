"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, EnrolmentProfile, Policy } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ListXIcon, PlusCircleIcon, PlusIcon, ShieldXIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "../../ui/separator";

export function PoliciesTable() {
    const [policies, setPolicies] = useState<{ data: Policy[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState([]);
    useEffect(() => {
        if (!policies.loaded) {
            fetch("/api/v1/policies", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setPolicies({ data, loaded: true });
            });
        }
    }, [policies.loaded]);
    const table = useReactTable({
        data: policies.data,
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
                header: "Blocks",
                cell: ({ row }) => {
                    return row.original.blocks.length;
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
                <CreatePolicyDialog onCreate={() => {
                    setPolicies({ data: [], loaded: false });
                }} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <ShieldXIcon />
                    </EmptyMedia>
                    <EmptyTitle>No policies found</EmptyTitle>
                    <EmptyDescription>Policies are used to configure devices. Create a new policy to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/policies/policy/${row.original.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}

function CreatePolicyDialog({ onCreate }: { onCreate: (policy: Policy) => void }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(0);
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Create Policy
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Policy</DialogTitle>
                    <DialogDescription>
                        Policies are used to enforce restrictions on devices by setting, and optionally locking, settings.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldDescription>The name of the policy.</FieldDescription>
                    <FieldContent>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <FieldDescription>The description of the policy. Not visible to end users.</FieldDescription>
                    <FieldContent>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Priority</FieldLabel>
                    <FieldDescription>The priority of the policy. Lower numbers have higher priority.</FieldDescription>
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
                        fetch("/api/v1/policies", {
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