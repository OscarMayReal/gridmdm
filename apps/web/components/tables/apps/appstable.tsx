"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { App, Device, EnrolmentProfile } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Grid2X2Icon, ListXIcon, PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

export function AppsTable() {
    const [apps, setApps] = useState<{ data: App[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState([]);
    useEffect(() => {
        if (!apps.loaded) {
            fetch("/api/v1/apps", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setApps({ data, loaded: true });
            });
        }
    }, [apps.loaded]);
    const table = useReactTable({
        data: apps.data,
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
                header: "Version",
                accessorKey: "version",
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
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <Grid2X2Icon />
                    </EmptyMedia>
                    <EmptyTitle>No Apps found</EmptyTitle>
                    <EmptyDescription>Manage what apps are allowed on devices. Acquire an app from the store to get started.</EmptyDescription>
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