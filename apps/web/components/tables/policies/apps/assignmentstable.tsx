"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AppPolicy, Device, EnrolmentProfile, KeyStoneGroup, Policy, PolicyAssignment } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ListXIcon, PlusCircleIcon, PlusIcon, ShieldXIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";

export function AppAssignmentsTable({ policy, setPolicy, refresh }: { policy: AppPolicy, setPolicy: (policy: AppPolicy) => void, refresh: () => void }) {
    const [columnFilters, setColumnFilters] = useState([]);
    const table = useReactTable({
        data: policy.assignments as PolicyAssignment[],
        state: {
            columnFilters,
        },
        columns: [
            {
                id: "group",
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
                <CreatePolicyDialog policy={policy} onCreate={() => {
                    refresh();
                }} />
            </div>
            <div className="bg-white rounded-md border-1 border-[#e4e4e7] overflow-hidden">
                <GenericTable fallback={<Empty className="flex flex-col gap-2">
                    <EmptyMedia variant="icon">
                        <ShieldXIcon />
                    </EmptyMedia>
                    <EmptyTitle>No assignments found</EmptyTitle>
                    <EmptyDescription>Assignments are used to assign policies to groups. Create a new assignment to get started.</EmptyDescription>
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

function CreatePolicyDialog({ policy, onCreate }: { policy: AppPolicy, onCreate: (policy: AppPolicy) => void }) {
    const [groupId, setGroupId] = useState("");
    useEffect(() => {
        console.log(groupId)
    }, [groupId]);
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
                    Create Assignment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                    <DialogDescription>
                        Assignments are used to assign policies to groups.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Group</FieldLabel>
                    <FieldDescription>The group to assign the policy to.</FieldDescription>
                    <FieldContent>
                        <Select value={groupId} onValueChange={setGroupId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id} disabled={policy.assignments.some((assignment) => assignment.groupId === group.id)}>
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
                        fetch("/api/v1/apps/policy/" + policy.id + "/assignments", {
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
