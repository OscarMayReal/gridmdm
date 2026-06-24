"use client"
import { GenericTable } from "@/components/generictable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MonitorSmartphoneIcon, PlusIcon, TrashIcon, UserIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ProfileAssignmentsTable({ profile, refresh }: { profile: any, refresh: () => void }) {
    return (
        <div className="flex flex-col gap-6">
            <AssignmentSection
                title="Users"
                addButton={<AddUserAssignmentDialog profile={profile} refresh={refresh} />}
                table={<UserAssignmentsTable profile={profile} refresh={refresh} />}
            />
            <AssignmentSection
                title="Admin-enrolled Devices"
                addButton={<AddDeviceAssignmentDialog profile={profile} refresh={refresh} />}
                table={<DeviceAssignmentsTable profile={profile} refresh={refresh} />}
            />
        </div>
    )
}

function AssignmentSection({ title, addButton, table }: { title: string, addButton: React.ReactNode, table: React.ReactNode }) {
    return (
        <div>
            <div className="flex flex-row items-center gap-[10px] pb-[10px]">
                <div className="font-medium">{title}</div>
                <div className="flex-1" />
                {addButton}
            </div>
            {table}
        </div>
    )
}

function UserAssignmentsTable({ profile, refresh }: { profile: any, refresh: () => void }) {
    const table = useReactTable({
        data: profile.userAssignments || [],
        columns: [
            { id: "name", header: "Name", accessorFn: (row: any) => row.user?.name },
            { id: "email", header: "Email", accessorFn: (row: any) => row.user?.email },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => {
                    fetch(`/api/v1/profiles/${profile.id}/assignments/users/${row.original.id}`, {
                        method: "DELETE",
                        credentials: "include"
                    }).then(() => refresh())
                }}><TrashIcon />Remove</Button>
            }
        ],
        getCoreRowModel: getCoreRowModel()
    });

    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
        <GenericTable fallback={<Empty className="flex flex-col gap-2">
            <EmptyMedia variant="icon"><UserIcon /></EmptyMedia>
            <EmptyTitle>No users assigned</EmptyTitle>
            <EmptyDescription>User-enrolled devices resolve profiles through their assigned user.</EmptyDescription>
        </Empty>} table={table} />
    </div>
}

function DeviceAssignmentsTable({ profile, refresh }: { profile: any, refresh: () => void }) {
    const table = useReactTable({
        data: profile.devices || [],
        columns: [
            { header: "Name", accessorKey: "name" },
            { id: "assignedUser", header: "Assigned User", accessorFn: (row: any) => row.user?.name || "" },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => {
                    fetch(`/api/v1/profiles/${profile.id}/assignments/devices/${row.original.id}`, {
                        method: "DELETE",
                        credentials: "include"
                    }).then(() => refresh())
                }}><TrashIcon />Remove</Button>
            }
        ],
        getCoreRowModel: getCoreRowModel()
    });

    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
        <GenericTable fallback={<Empty className="flex flex-col gap-2">
            <EmptyMedia variant="icon"><MonitorSmartphoneIcon /></EmptyMedia>
            <EmptyTitle>No devices assigned</EmptyTitle>
            <EmptyDescription>Admin-enrolled devices can be assigned directly to one profile.</EmptyDescription>
        </Empty>} table={table} />
    </div>
}

function AddUserAssignmentDialog({ profile, refresh }: { profile: any, refresh: () => void }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            fetch(`/api/v1/users?search=${encodeURIComponent(search)}`, {
                credentials: "include"
            }).then(res => res.json()).then(setUsers)
        }
    }, [open, search]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon />Assign User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign User</DialogTitle>
                    <DialogDescription>Assign this profile to a KeyStone user.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Search</FieldLabel>
                    <FieldDescription>Find a user by name or email.</FieldDescription>
                    <FieldContent>
                        <Input value={search} onChange={(event) => setSearch(event.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>User</FieldLabel>
                    <FieldDescription>The user to assign.</FieldDescription>
                    <FieldContent>
                        <Select value={userId} onValueChange={setUserId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name} ({user.email})
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
                        fetch(`/api/v1/profiles/${profile.id}/assignments/users`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ userId })
                        }).then(() => {
                            setOpen(false);
                            refresh();
                        })
                    }}><PlusIcon />Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AddDeviceAssignmentDialog({ profile, refresh }: { profile: any, refresh: () => void }) {
    const [open, setOpen] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [devices, setDevices] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            fetch("/api/v1/devices", {
                credentials: "include"
            }).then(res => res.json()).then(setDevices)
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon />Assign Device</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Device</DialogTitle>
                    <DialogDescription>Assign this profile directly to an admin-enrolled device.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Device</FieldLabel>
                    <FieldDescription>The admin-enrolled device to assign.</FieldDescription>
                    <FieldContent>
                        <Select value={deviceId} onValueChange={setDeviceId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a device" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map((device) => (
                                    <SelectItem key={device.id} value={device.id} disabled={device.profileId && device.profileId !== profile.id}>
                                        {device.name}
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
                        fetch(`/api/v1/profiles/${profile.id}/assignments/devices`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ deviceId })
                        }).then(() => {
                            setOpen(false);
                            refresh();
                        })
                    }}><PlusIcon />Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
