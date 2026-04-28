"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Device, EnrolmentProfile, EnrolmentProfileCondition, EnrolmentProfileGroupAssignment, KeyStoneGroup, Policy, PolicyAssignment } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { GroupIcon, ListXIcon, PlusCircleIcon, PlusIcon, ShieldXIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "../../ui/separator";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";

export function GroupsConditionsTable({ profile, refresh }: { profile: EnrolmentProfile | null, refresh: () => void }) {
    const [columnFilters, setColumnFilters] = useState([]);
    const table = useReactTable({
        data: profile?.conditions as EnrolmentProfileCondition[],
        state: {
            columnFilters,
        },
        columns: [
            {
                accessorFn: (row) => row.group?.name,
                header: "Group",
            },
        ],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })
    const router = useRouter();
    return (
        <>
            <div className="flex flex-row gap-[10px] pb-[10px]">
                <CreatePolicyDialog profile={profile} onCreate={() => {
                    refresh();
                }} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <GroupIcon />
                    </EmptyMedia>
                    <EmptyTitle>No assignments found</EmptyTitle>
                    <EmptyDescription>Assignments are used to assign groups to devices in profiles. Create a new assignment to get started.</EmptyDescription>
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

function CreatePolicyDialog({ profile, onCreate }: { profile: EnrolmentProfile, onCreate: (policy: Policy) => void }) {
    const [groupId, setGroupId] = useState("");
    const [open, setOpen] = useState(false);
    const [groups, setGroups] = useState<KeyStoneGroup[]>([]);
    useEffect(() => {
        fetch("/api/v1/groups", {
            credentials: "include",
        }).then(res => res.json()).then(data => {
            setGroups(data);
        });
    }, []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Create Condition
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Condition</DialogTitle>
                    <DialogDescription>
                        Conditions are used to determine if a profile should be applied to a device.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Group</FieldLabel>
                    <FieldDescription>The group the user should be in for the profile to be applied.</FieldDescription>
                    <FieldContent>
                        <Select value={groupId} onValueChange={setGroupId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id} disabled={profile.conditions.some((condition) => condition.groupId === group.id)}>
                                        {group.name}
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
                    <Button variant="default" onClick={() => {
                        fetch("/api/v1/profiles/" + profile?.id + "/conditions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                groupId,
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