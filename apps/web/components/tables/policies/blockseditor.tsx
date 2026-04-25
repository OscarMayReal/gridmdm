"use client"
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, Column, Table } from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import { Device, EnrolmentProfile, Policy, PolicyBlock } from "@repo/database";
import { GenericTable } from "@/components/generictable";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileIcon, KeyIcon, ListXIcon, PenIcon, PlayIcon, PlusCircleIcon, PlusIcon, SettingsIcon, ShieldXIcon, TerminalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "../../ui/separator";
import { PolicyContext } from "@/app/app/policies/policy/[policyid]/layout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar";
import { PolicyLibrary } from "@/lib/policylibrary";
import { useDebounce } from "@uidotdev/usehooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function BlocksEditor() {
    const { policy, refresh, loaded } = useContext(PolicyContext)
    const [columnFilters, setColumnFilters] = useState([]);
    const router = useRouter();
    if (!loaded) {
        return null
    }
    return (
        <div className="flex flex-col gap-[10px]">
            {policy?.blocks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((block) => (
                <PolicyBlockEditor key={block.id} block={block} refresh={refresh} />
            ))}
            {policy?.blocks.length === 0 && (
                <Empty className="flex flex-col gap-2" style={{ paddingBottom: 0 }}>
                    <EmptyMedia className="border-1 bg-white" variant="icon">
                        <ShieldXIcon />
                    </EmptyMedia>
                    <EmptyTitle>No blocks found</EmptyTitle>
                    <EmptyDescription>Add blocks to this policy to enforce restrictions on devices.</EmptyDescription>
                </Empty>)}
            <div className="mt-2 w-full flex flex-row justify-center">
                <CreateDropdown policyId={policy.id} refresh={refresh} />
            </div>
        </div>
    )
}

const policyBlockTypeMappings = {
    "DCONF": {
        friendlyName: "Settings",
        Icon: SettingsIcon,
    },
    "FILE": {
        friendlyName: "File",
        Icon: FileIcon,
    },
    "EXEC": {
        friendlyName: "Command",
        Icon: TerminalIcon,
    },
    "SYSTEMD": {
        friendlyName: "Systemd",
        Icon: PlayIcon,
    },
    "LAPS": {
        friendlyName: "LAPS",
        Icon: KeyIcon,
    }
}
function PolicyBlockEditor({ block, refresh }: { block: PolicyBlock, refresh: () => void }) {
    const [content, setContent] = useState(block.content)
    const [description, setDescription] = useState(block.description)
    const debouncedDescription = useDebounce(description, 500)
    const { policy, setPolicy } = useContext(PolicyContext)
    useEffect(() => {
        if (debouncedDescription !== block.description) {
            updatePolicyBlock({ blockId: block.id, data: { description: debouncedDescription }, policyId: policy.id }).then((data: Policy) => setPolicy({ ...policy, blocks: policy.blocks.map((b) => b.id === block.id ? data : b) }))
        }
    }, [debouncedDescription])
    useEffect(() => {
        if (content !== block.content) {
            updatePolicyBlock({ blockId: block.id, data: { content }, policyId: policy.id }).then((data: Policy) => setPolicy({ ...policy, blocks: policy.blocks.map((b) => b.id === block.id ? data : b) }))
        }
    }, [content])
    return (
        <Card className="flex flex-col gap-2 shadow-none border-1 border-[#e4e4e7]">
            <CardHeader>
                <Item className="p-0 flex flex-row items-center">
                    <div className="bg-[#6d54e9] p-2 rounded-md">
                        {
                            (() => {
                                const Icon = policyBlockTypeMappings[block.type].Icon
                                return <Icon className="text-white" />
                            })()
                        }
                    </div>
                    <ItemContent className="flex flex-col gap-0">
                        <ItemTitle>
                            <input className="w-full text-lg text-[#666666] placeholder-[#999999] outline-none" placeholder="Block Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </ItemTitle>
                        <ItemDescription>{policyBlockTypeMappings[block.type].friendlyName}</ItemDescription>
                    </ItemContent>
                </Item>
            </CardHeader>
            <CardContent>
                {block.type === "DCONF" && (
                    <>
                        {content.settings.length > 0 && <ItemGroup className="flex flex-col border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden mb-4">
                            {content.settings.map((setting, index) => (
                                <SettingItem key={setting.key} setting={setting} index={index} setContent={setContent} content={content} />
                            ))}
                        </ItemGroup>}
                        <div className="flex flex-row justify-center mt-2">
                            <SettingsLibraryDialog content={content} setContent={setContent} />
                        </div>
                    </>
                )}
                {block.type === "FILE" && (
                    <>
                        {content.files.length > 0 && <ItemGroup className="flex flex-col border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden mb-4">
                            {content.files.map((file, index) => (
                                <FileItem key={file.path} file={file} index={index} setContent={setContent} content={content} />
                            ))}
                        </ItemGroup>}
                        <div className="flex flex-row justify-center mt-2">
                            <FileCreateDialog content={content} setContent={setContent} />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

function FileCreateDialog({ content, setContent }: { content: any, setContent: (content: any) => void }) {
    const [source, setSource] = useState("")
    const [path, setPath] = useState("")
    const [name, setName] = useState("")
    const [conflict, setConflict] = useState<"overwrite" | "ignore">("overwrite")
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-[#666666]"><PlusIcon />Add File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add File</DialogTitle>
                    <DialogDescription>Add a file to the policy</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldDescription>The name of the file.</FieldDescription>
                    <FieldContent>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Source</FieldLabel>
                    <FieldDescription>The source of the file.</FieldDescription>
                    <FieldContent>
                        <Input value={source} type="url" onChange={(e) => setSource(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Path</FieldLabel>
                    <FieldDescription>The path of the file.</FieldDescription>
                    <FieldContent>
                        <Input value={path} type="url" onChange={(e) => setPath(e.target.value)} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Conflict</FieldLabel>
                    <FieldDescription>Whether the file conflicts with other files.</FieldDescription>
                    <FieldContent>
                        <Select value={conflict} onValueChange={(value) => setConflict(value as "overwrite" | "ignore")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overwrite">Overwrite</SelectItem>
                                <SelectItem value="ignore">Ignore</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"><XIcon />Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => {
                            setContent({
                                ...content,
                                files: [
                                    ...content.files,
                                    {
                                        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                        name: name,
                                        path: path,
                                        source: source,
                                        conflict: conflict
                                    }
                                ]
                            })
                        }}><PlusIcon />Add File</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function FileItem({ file, index, setContent, content }: { file: { id: string, name: string, path: string, source: string, conflict: "overwrite" | "ignore" }, index: number, setContent: (content: any) => void, content: any }) {
    return (
        <Item key={file.id} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7]" : "") + " hover:bg-[#fafafa] rounded-t-none"}>
            <ItemMedia>
                <div className={`icon-file`} style={{ color: "#666666" }}></div>
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="text-[#666666]">{file.name}</ItemTitle>
                <ItemDescription className="text-[#999999]">{file.path}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" className="text-[#666666]" size="sm" onClick={() => {
                    const newContent = { ...content }
                    newContent.files = newContent.files.filter((f: any, i: number) => i !== index)
                    setContent(newContent)
                }}>
                    <XIcon />
                    Remove
                </Button>
            </ItemActions>
        </Item>
    )
}

function SettingItem({ setting, index, setContent, content }: { setting: { key: string, value: any, value_type: string, locked: boolean, description: string }, index: number, setContent: (content: any) => void, content: any }) {
    const settingInfo = PolicyLibrary.categories.find((category) => category.groups.find((group) => group.settings.find((s) => s.key === setting.key)))?.groups.find((group) => group.settings.find((s) => s.key === setting.key))?.settings.find((s) => s.key === setting.key)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Item key={setting.key} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7]" : "") + " hover:bg-[#fafafa] rounded-t-none"}>
                    <ItemMedia>
                        <div className={`icon-${settingInfo?.icon}`} style={{ color: "#666666" }}></div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">{settingInfo?.friendly_name}</ItemTitle>
                        <ItemDescription className="text-[#999999]">{settingInfo?.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="ghost" className="text-[#666666]" size="sm" onClick={() => {
                            const newContent = { ...content }
                            newContent.settings = newContent.settings.filter((s, i) => i !== index)
                            setContent(newContent)
                        }}>
                            <XIcon />
                            Remove
                        </Button>
                    </ItemActions>
                </Item>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{settingInfo?.friendly_name}</DialogTitle>
                    <DialogDescription>{settingInfo?.description}</DialogDescription>
                </DialogHeader>
                {settingInfo?.enum && (
                    <Select value={content.settings[index].value} onValueChange={(e) => {
                        const newContent = { ...content }
                        newContent.settings[index].value = e
                        setContent(newContent)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                            {settingInfo.enum.map((value) => (
                                <SelectItem key={value.value} value={value.value}>{value.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {!settingInfo?.enum && settingInfo?.value_type === "string" && (
                    <Input value={content.settings[index].value} onChange={(e) => {
                        const newContent = { ...content }
                        newContent.settings[index].value = e.target.value
                        setContent(newContent)
                    }} />
                )}
                {!settingInfo?.enum && settingInfo?.value_type === "bool" && (
                    <Checkbox checked={content.settings[index].value} onCheckedChange={(e) => {
                        const newContent = { ...content }
                        newContent.settings[index].value = e
                        setContent(newContent)
                    }} />
                )}
                {!settingInfo?.enum && (settingInfo?.value_type === "uint32" || settingInfo?.value_type === "int32") && (
                    <Input type="number" value={content.settings[index].value} onChange={(e) => {
                        const newContent = { ...content }
                        newContent.settings[index].value = e.target.value
                        setContent(newContent)
                    }} />
                )}
                <Field>
                    <FieldLabel>Lock Setting</FieldLabel>
                    <FieldDescription>Locked settings cannot be changed by the user.</FieldDescription>
                    <FieldContent>
                        <Select value={content.settings[index].locked ? "true" : "false"} onValueChange={(e) => {
                            const newContent = { ...content }
                            newContent.settings[index].locked = e === "true"
                            setContent(newContent)
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Lock Setting</SelectItem>
                                <SelectItem value="false">Unlock Setting</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline"><XIcon />Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function CreateDropdown({ refresh, policyId }: { refresh: () => void, policyId: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Add Block
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => createBlock({ type: "DCONF", policyId, content: { "settings": [] } }).then(() => refresh())}><SettingsIcon />Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => createBlock({ type: "FILE", policyId, content: { "files": [] } }).then(() => refresh())}><FileIcon />File</DropdownMenuItem>
                <DropdownMenuItem onClick={() => createBlock({ type: "EXEC", policyId, content: { "commands": [] } }).then(() => refresh())}><TerminalIcon />Command</DropdownMenuItem>
                <DropdownMenuItem onClick={() => createBlock({ type: "SYSTEMD", policyId, content: { "services": [] } }).then(() => refresh())}><PlayIcon />Systemd</DropdownMenuItem>
                <DropdownMenuItem onClick={() => createBlock({ type: "LAPS", policyId, content: { "laps": {} } }).then(() => refresh())}><KeyIcon />LAPS</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

async function createBlock({ type, policyId, content }: { type: string, policyId: string, content: any }) {
    const res = await fetch(`/api/v1/policies/${policyId}/blocks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type,
            content
        })
    })
    const data = await res.json();
    return data;
}

async function updatePolicyBlock({ blockId, data, policyId }: { blockId: string, data: any, policyId: string }) {
    const res = await fetch(`/api/v1/policies/${policyId}/blocks/${blockId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    return result;
}

function SettingsLibraryDialog({ content, setContent }: { content: any, setContent: (content: any) => void }) {
    const [selectedCategory, setSelectedCategory] = useState(PolicyLibrary.categories[0].id);
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogHeader className="hidden">
                <DialogTitle>Add Setting from Library</DialogTitle>
                <DialogDescription>Add a setting from the library to the policy.</DialogDescription>
            </DialogHeader>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-[#666666]">
                    <PlusIcon />
                    Add Setting from Library
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[75vw] max-h-[75vh] min-w-[75vw] min-h-[75vh] p-0 overflow-hidden flex flex-row gap-0 bg-[#f5f5f5]">
                <Sidebar className="static w-[250px] h-full">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Categories</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-[4px]">
                                {PolicyLibrary.categories.map((category) => (
                                    <SidebarCategory key={category.id} category={category} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
                                ))}
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <div className="flex-1 flex flex-col gap-[25px] p-[20px] overflow-y-auto">
                    <div>
                        <div className="text-xl font-medium text-[#666666]">{PolicyLibrary.categories.find((category) => category.id === selectedCategory)?.name}</div>
                        <div className="text-md text-[#999999]">{PolicyLibrary.categories.find((category) => category.id === selectedCategory)?.description}</div>
                    </div>
                    {PolicyLibrary.categories.find((category) => category.id === selectedCategory)?.groups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-[10px]">
                            <div className="text-sm text-[#999999]">{group.name}</div>
                            <ItemGroup className="bg-white border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden">
                                {group.settings.map((setting, index) => (
                                    <Item key={setting.key} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7] rounded-t-none" : "rounded-t-none") + " hover:bg-[#fafafa]"} onClick={() => {
                                        setContent({
                                            ...content,
                                            settings: [
                                                ...content.settings,
                                                {
                                                    key: setting.key,
                                                    value: setting.default_value,
                                                    value_type: setting.value_type,
                                                    locked: false
                                                }
                                            ]
                                        })
                                        setOpen(false)
                                    }}>
                                        <ItemMedia>
                                            <div className={`icon-${setting.icon}`}></div>
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>{setting.friendly_name}</ItemTitle>
                                            <ItemDescription>{setting.description}</ItemDescription>
                                        </ItemContent>
                                    </Item>
                                ))}
                            </ItemGroup>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function SidebarCategory({ category, setSelectedCategory, selectedCategory }: { category: { name: string, icon: string, id: string }, setSelectedCategory: (category: string) => void, selectedCategory: string }) {
    return <SidebarMenuButton className={(selectedCategory === category.id) ? "bg-[#6D54E9] text-white hover:bg-[#6D54E9] hover:text-white" : ""} onClick={() => setSelectedCategory(category.id)}>
        <div className={`icon-${category.icon}`}></div>
        {category.name}
    </SidebarMenuButton>
}