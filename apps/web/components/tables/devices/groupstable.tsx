"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, KeyStoneGroup } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { GroupIcon, LaptopMinimalIcon, ListXIcon } from "lucide-react";
import { DeviceGroup } from "@repo/database";

export function DevicesGroupsTable({device}: {device: Device}) {
    const [columnFilters, setColumnFilters] = useState<{ id: string, value: string }[]>([]);
    const table = useReactTable({
        data: device.groups || [] as (DeviceGroup&{group: KeyStoneGroup})[],
        state: {
            columnFilters: columnFilters,
        },
        columns: [
            {
                id: "displayName",
                header: "Display Name",
                cell: ({ row }) => {
                    return row.original.group.name;
                }
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => {
                    return device.tenant.name + "/" + row.original.group.groupname;
                },
                filterFn: "includesString"
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
                        <GroupIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Groups found</EmptyTitle>
                    <EmptyDescription>Groups define how devices are organized and managed. Add the device to a group in KeyStone to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/groups/group/${row.original.group.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}
