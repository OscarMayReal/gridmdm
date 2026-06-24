"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, KeyStoneGroup } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LaptopMinimalIcon, ListXIcon } from "lucide-react";

export function GroupsTable() {
    const [groups, setGroups] = useState<{ data: KeyStoneGroup[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState([]);
    useEffect(() => {
        if (!groups.loaded) {
            fetch("/api/v1/groups", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setGroups({ data: data, loaded: true });
            });
        }
    }, [groups.loaded]);
    const table = useReactTable({
        data: groups.data,
        state: {
            columnFilters,
        },
        columns: [
            {
                accessorKey: "name",
                header: "Display Name",
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => {
                    return row.original.tenant.name + "/" + row.original.groupname;
                },
                filterFn: "includesString"
            },
            {
                id: "devices",
                header: "Devices",
                accessorFn: (row) => row.devices.length,
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
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <LaptopMinimalIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Groups found</EmptyTitle>
                    <EmptyDescription>Groups are used to organize your fleet. Create a new group from KeyStone to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/groups/group/${row.original.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}
