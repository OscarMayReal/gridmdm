"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, KeyStoneGroup, Policy } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { GroupIcon, LaptopMinimalIcon, ListXIcon } from "lucide-react";
import { DeviceGroup } from "@repo/database";

export function DevicesAppPoliciesTable({device}: {device: Device}) {
    const [columnFilters, setColumnFilters] = useState<{ id: string, value: string }[]>([]);
    const [policies, setPolicies] = useState<(Policy)[]>([]);
    useEffect(() => {
        if (!device || policies.length > 0) return;
        setPolicies(device.groups.flatMap(group => group.group.appPolicyAssignments.map(policy => policy.appPolicy)));
    }, [device, policies]);
    const table = useReactTable({
        data: policies || [] as (Policy)[],
        state: {
            columnFilters: columnFilters,
        },
        columns: [
            {
                header: "Display Name",
                id: "name",
                accessorKey: "name",
                cell: ({ row }) => {
                    return row.original.name;
                },
                filterFn: "includesString"
            },
            {
                id: "description",
                accessorKey: "description",
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
                        <ListXIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Policies found</EmptyTitle>
                    <EmptyDescription>Policies define how devices are configured and managed. Add the device to a policy in the policies page.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/policies/application/policy/${row.original.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}