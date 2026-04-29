"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty";
import { LaptopMinimalIcon, ListXIcon } from "lucide-react";

export function DevicesTable({mode = "all"}:{mode?: "all" | "user" | "admin"}) {
    const [devices, setDevices] = useState<{ data: Device[], loaded: boolean }>({ data: [], loaded: false });
    const [columnFilters, setColumnFilters] = useState([]);
    useEffect(() => {
        if (!devices.loaded) {
            fetch("/api/v1/devices", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            }).then(res => res.json()).then(data => {
                setDevices({ data: mode === "all" ? data : data.filter((device: Device) => device.isSelfEnrolled === (mode === "user")), loaded: true });
            });
        }
    }, [devices.loaded]);
    const table = useReactTable({
        data: devices.data,
        state: {
            columnFilters,
        },
        columns: [
            {
                accessorKey: "displayName",
                header: "Display Name",
            },
            {
                id: "name",
                header: "Name",
                accessorKey: "name",
                cell: ({ row }) => {
                    return row.original.tenant.name + "/" + row.original.name;
                },
                filterFn: "includesString"
            },
            {
                header: "Hardware Type",
                accessorKey: "hardwareType",
                cell: ({ row }) => {
                    return row.original.hardwareType[0].toUpperCase() + row.original.hardwareType.slice(1).toLowerCase();
                }
            },
            {
                header: "Software Type",
                accessorKey: "softwareType",
                cell: ({ row }) => {
                    return row.original.softwareType == "THETAOS" ? "ThetaOS" : "Other";
                }
            },
            {
                header: "Enrollment Type",
                accessorKey: "isSelfEnrolled",
                cell: ({ row }) => {
                    return row.original.isSelfEnrolled ? "Self" : "Admin";
                },
            },
            {
                header: "Assigned To",
                accessorKey: "user",
                cell: ({ row }) => {
                    return row.original.user?.username ? row.original.tenant.name + "/" + row.original.user?.username : "Not Assigned";
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
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <LaptopMinimalIcon />
                    </EmptyMedia>
                    <EmptyTitle>No devices found</EmptyTitle>
                    <EmptyDescription>Devices are used to manage your fleet. Enroll a new device from KeyStone to get started.</EmptyDescription>
                </Empty>} table={table} onRowClick={(row) => router.push(`/app/devices/device/${row.original.id}`)} />
            </div>
        </>
    )
}

function Filter({ columnFilterValue, setColumnFilterValue }: { columnFilterValue: { id: string, value: string }[], setColumnFilterValue: (value: { id: string, value: string }[]) => void }) {
    return (
        <Input placeholder="Search" className="w-[300px] bg-white" value={columnFilterValue.find((filter) => filter.id === "name")?.value} onChange={(e) => setColumnFilterValue([{ id: "name", value: e.target.value }])} />
    )
}