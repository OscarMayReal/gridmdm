"use client"
import { usePageContext } from "@/components/pageheader";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { GenericTable } from "@/components/generictable";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileIcon, LayoutGridIcon, ListIcon, PlusIcon, SaveIcon, SettingsIcon, TrashIcon, XIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar";
import { PolicyLibrary } from "@/lib/policylibrary";

export default function ConfigurationPage({ params }: { params: Promise<{ configurationid: string }> }) {
    const { configurationid } = use(params);
    const { setAreaTitle, setIcon, setTitle, setDescription } = usePageContext();
    const [configuration, setConfiguration] = useState<any>(null);

    const loadConfiguration = () => {
        fetch(`/api/v1/configurations/${configurationid}`, {
            credentials: "include"
        }).then(res => res.json()).then(data => {
            setConfiguration(data);
        });
    }

    useEffect(() => {
        loadConfiguration();
    }, [configurationid]);

    useEffect(() => {
        if (configuration) {
            setTitle(configuration.name);
            setDescription("Manage this configuration");
            setAreaTitle("Configuration");
            setIcon(ListIcon);
        }
    }, [configuration]);

    if (!configuration) return null;

    const save = (content = configuration.content) => {
        fetch(`/api/v1/configurations/${configuration.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                name: configuration.name,
                description: configuration.description,
                type: configuration.type,
                content
            })
        }).then(() => loadConfiguration());
    }

    return <div className="p-4 flex flex-col gap-4">
        <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4 flex flex-col gap-4">
            <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldDescription>The name of the configuration.</FieldDescription>
                <FieldContent><Input value={configuration.name || ""} onChange={(event) => setConfiguration({ ...configuration, name: event.target.value })} /></FieldContent>
            </Field>
            <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldDescription>The description of the configuration.</FieldDescription>
                <FieldContent><Input value={configuration.description || ""} onChange={(event) => setConfiguration({ ...configuration, description: event.target.value })} /></FieldContent>
            </Field>
            <Field>
                <FieldLabel>Type</FieldLabel>
                <FieldDescription>The type is set when the configuration is created.</FieldDescription>
                <FieldContent>
                    <Input value={configuration.type} readOnly />
                </FieldContent>
            </Field>
            <Separator />
            <div>
                <Button onClick={() => save()}><SaveIcon />Save Details</Button>
            </div>
        </div>
        <ConfigurationContentEditor configuration={configuration} save={save} />
    </div>
}

function ConfigurationContentEditor({ configuration, save }: { configuration: any, save: (content: any) => void }) {
    if (configuration.type === "DCONF") return <SettingsEditor content={configuration.content || { settings: [] }} save={save} />;
    if (configuration.type === "FILE") return <FilesEditor content={configuration.content || { files: [] }} save={save} />;
    if (configuration.type === "EXEC") return <ListEditor title="Commands" itemKey="commands" placeholder="Command" content={configuration.content || { commands: [] }} save={save} />;
    if (configuration.type === "SYSTEMD") return <ListEditor title="Services" itemKey="services" placeholder="Service name" content={configuration.content || { services: [] }} save={save} />;
    if (configuration.type === "LAPS") return <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4 text-sm text-[#666666]">LAPS has no additional options.</div>;
    if (configuration.type === "ALLOWED_APPS") return <AllowedAppsEditor configuration={configuration} save={save} />;
    return null;
}

function SettingsEditor({ content, save }: { content: any, save: (content: any) => void }) {
    const settings = content.settings || [];
    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4">
        {settings.length > 0 && <ItemGroup className="flex flex-col border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden mb-4">
            {settings.map((setting: any, index: number) => (
                <SettingItem key={setting.key} setting={setting} index={index} content={{ ...content, settings }} save={save} />
            ))}
        </ItemGroup>}
        <div className="flex flex-row justify-center mt-2">
            <SettingsLibraryDialog content={{ ...content, settings }} save={save} />
        </div>
    </div>
}

function FilesEditor({ content, save }: { content: any, save: (content: any) => void }) {
    const files = content.files || [];
    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4">
        {files.length > 0 && <ItemGroup className="flex flex-col border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden mb-4">
            {files.map((file: any, index: number) => (
                <Item key={file.id || file.path} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7]" : "") + " hover:bg-[#fafafa] rounded-t-none"}>
                    <ItemMedia><FileIcon /></ItemMedia>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">{file.name}</ItemTitle>
                        <ItemDescription className="text-[#999999]">{file.path}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="ghost" className="text-[#666666]" size="sm" onClick={() => save({ ...content, files: files.filter((_: any, fileIndex: number) => fileIndex !== index) })}>
                            <XIcon />Remove
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </ItemGroup>}
        <div className="flex flex-row justify-center mt-2">
            <FileCreateDialog content={{ ...content, files }} save={save} />
        </div>
    </div>
}

function ListEditor({ title, itemKey, placeholder, content, save }: { title: string, itemKey: string, placeholder: string, content: any, save: (content: any) => void }) {
    const [value, setValue] = useState("");
    const items = content[itemKey] || [];
    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4 flex flex-col gap-4">
        <div className="font-medium">{title}</div>
        {items.length > 0 && <ItemGroup className="flex flex-col border-1 border-[#e4e4e7] rounded-lg overflow-y-hidden">
            {items.map((item: any, index: number) => (
                <Item key={index} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7]" : "") + " hover:bg-[#fafafa] rounded-t-none"}>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">{typeof item === "string" ? item : item.name || item.command || item.service}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="ghost" className="text-[#666666]" size="sm" onClick={() => save({ ...content, [itemKey]: items.filter((_: any, itemIndex: number) => itemIndex !== index) })}>
                            <XIcon />Remove
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </ItemGroup>}
        <div className="flex flex-row gap-2">
            <Input placeholder={placeholder} value={value} onChange={(event) => setValue(event.target.value)} />
            <Button variant="outline" onClick={() => {
                if (!value) return;
                save({ ...content, [itemKey]: [...items, value] });
                setValue("");
            }}><PlusIcon />Add</Button>
        </div>
    </div>
}

function FileCreateDialog({ content, save }: { content: any, save: (content: any) => void }) {
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
                    <DialogDescription>Add a file to the configuration.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldDescription>The name of the file.</FieldDescription>
                    <FieldContent><Input value={name} onChange={(e) => setName(e.target.value)} /></FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Source</FieldLabel>
                    <FieldDescription>The source of the file.</FieldDescription>
                    <FieldContent><Input value={source} type="url" onChange={(e) => setSource(e.target.value)} /></FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Path</FieldLabel>
                    <FieldDescription>The path of the file.</FieldDescription>
                    <FieldContent><Input value={path} onChange={(e) => setPath(e.target.value)} /></FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Conflict</FieldLabel>
                    <FieldDescription>How to handle an existing file.</FieldDescription>
                    <FieldContent>
                        <Select value={conflict} onValueChange={(value) => setConflict(value as "overwrite" | "ignore")}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select a mode" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overwrite">Overwrite</SelectItem>
                                <SelectItem value="ignore">Ignore</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <Separator />
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline"><XIcon />Cancel</Button></DialogClose>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => {
                            save({
                                ...content,
                                files: [...(content.files || []), {
                                    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                                    name,
                                    path,
                                    source,
                                    conflict
                                }]
                            })
                        }}><PlusIcon />Add File</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SettingItem({ setting, index, content, save }: { setting: any, index: number, content: any, save: (content: any) => void }) {
    const settingInfo = PolicyLibrary.categories.find((category) => category.groups.find((group) => group.settings.find((s) => s.key === setting.key)))?.groups.find((group) => group.settings.find((s) => s.key === setting.key))?.settings.find((s) => s.key === setting.key)
    const updateSetting = (value: any) => {
        const settings = [...(content.settings || [])];
        settings[index] = { ...settings[index], ...value };
        save({ ...content, settings });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Item key={setting.key} className={(index !== 0 ? "border-t-1 border-t-[#e4e4e7]" : "") + " hover:bg-[#fafafa] rounded-t-none"}>
                    <ItemMedia><div className={`icon-${settingInfo?.icon}`} style={{ color: "#666666" }}></div></ItemMedia>
                    <ItemContent>
                        <ItemTitle className="text-[#666666]">{settingInfo?.friendly_name || setting.key}</ItemTitle>
                        <ItemDescription className="text-[#999999]">{settingInfo?.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="ghost" className="text-[#666666]" size="sm" onClick={(event) => {
                            event.stopPropagation();
                            save({ ...content, settings: content.settings.filter((_: any, settingIndex: number) => settingIndex !== index) })
                        }}>
                            <XIcon />Remove
                        </Button>
                    </ItemActions>
                </Item>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{settingInfo?.friendly_name || setting.key}</DialogTitle>
                    <DialogDescription>{settingInfo?.description}</DialogDescription>
                </DialogHeader>
                {settingInfo?.enum && (
                    <Select value={content.settings[index].value} onValueChange={(value) => updateSetting({ value })}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select a value" /></SelectTrigger>
                        <SelectContent>
                            {settingInfo.enum.map((value) => (
                                <SelectItem key={value.value} value={value.value}>{value.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {!settingInfo?.enum && settingInfo?.value_type === "string" && <Input value={content.settings[index].value} onChange={(event) => updateSetting({ value: event.target.value })} />}
                {!settingInfo?.enum && settingInfo?.value_type === "bool" && (
                    <Select value={content.settings[index].value ? "true" : "false"} onValueChange={(value) => updateSetting({ value: value === "true" })}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                {!settingInfo?.enum && (settingInfo?.value_type === "uint32" || settingInfo?.value_type === "int32") && <Input type="number" value={content.settings[index].value} onChange={(event) => updateSetting({ value: event.target.value })} />}
                <Field>
                    <FieldLabel>Lock Setting</FieldLabel>
                    <FieldDescription>Locked settings cannot be changed by the user.</FieldDescription>
                    <FieldContent>
                        <Select value={content.settings[index].locked ? "true" : "false"} onValueChange={(value) => updateSetting({ locked: value === "true" })}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select a value" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Lock Setting</SelectItem>
                                <SelectItem value="false">Unlock Setting</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline"><XIcon />Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SettingsLibraryDialog({ content, save }: { content: any, save: (content: any) => void }) {
    const [selectedCategory, setSelectedCategory] = useState(PolicyLibrary.categories[0].id);
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogHeader className="hidden">
                <DialogTitle>Add Setting from Library</DialogTitle>
                <DialogDescription>Add a setting from the library to the configuration.</DialogDescription>
            </DialogHeader>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-[#666666]"><PlusIcon />Add Setting from Library</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[75vw] max-h-[75vh] min-w-[75vw] min-h-[75vh] p-0 overflow-hidden flex flex-row gap-0 bg-[#f5f5f5]">
                <Sidebar className="static w-[250px] h-full">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Categories</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-[4px]">
                                {PolicyLibrary.categories.map((category) => (
                                    <SidebarMenuButton key={category.id} className={(selectedCategory === category.id) ? "bg-[#6D54E9] text-white hover:bg-[#6D54E9] hover:text-white" : ""} onClick={() => setSelectedCategory(category.id)}>
                                        <div className={`icon-${category.icon}`}></div>
                                        {category.name}
                                    </SidebarMenuButton>
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
                                        save({
                                            ...content,
                                            settings: [...(content.settings || []), {
                                                key: setting.key,
                                                value: setting.default_value,
                                                value_type: setting.value_type,
                                                locked: false
                                            }]
                                        })
                                        setOpen(false)
                                    }}>
                                        <ItemMedia><div className={`icon-${setting.icon}`}></div></ItemMedia>
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

function AllowedAppsEditor({ configuration, save }: { configuration: any, save: (content: any) => void }) {
    const [apps, setApps] = useState<any[]>([]);
    const [appId, setAppId] = useState("");
    const [rule, setRule] = useState("OPTIONAL");
    const entries = configuration.content?.apps || [];

    useEffect(() => {
        fetch("/api/v1/apps", {
            credentials: "include"
        }).then(res => res.json()).then(setApps)
    }, []);

    const table = useReactTable({
        data: entries,
        columns: [
            { id: "app", header: "App", accessorFn: (row: any) => row.app?.name || apps.find((app) => app.id === row.appId)?.name || row.appId },
            { id: "rule", header: "Rule", accessorKey: "rule" },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => {
                    save({ apps: entries.filter((entry: any) => entry.appId !== row.original.appId) });
                }}><TrashIcon />Remove</Button>
            }
        ],
        getCoreRowModel: getCoreRowModel()
    });

    return <div className="bg-white rounded-md border-1 border-[#e4e4e7] p-4 flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-end">
            <Field className="flex-1">
                <FieldLabel>App</FieldLabel>
                <FieldDescription>The app to allow.</FieldDescription>
                <FieldContent>
                    <Select value={appId} onValueChange={setAppId}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select an app" /></SelectTrigger>
                        <SelectContent>
                            {apps.map((app) => <SelectItem key={app.id} value={app.id} disabled={entries.some((entry: any) => entry.appId === app.id)}>{app.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>
            <Field className="w-[180px]">
                <FieldLabel>Rule</FieldLabel>
                <FieldDescription>Install behavior.</FieldDescription>
                <FieldContent>
                    <Select value={rule} onValueChange={setRule}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FORCED">Forced</SelectItem>
                            <SelectItem value="OPTIONAL">Optional</SelectItem>
                            <SelectItem value="ALLOWED">Allowed</SelectItem>
                            <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                    </Select>
                </FieldContent>
            </Field>
            <Button onClick={() => {
                const app = apps.find((candidate) => candidate.id === appId);
                save({ apps: [...entries, { appId, rule, app }] });
            }}><PlusIcon />Add</Button>
        </div>
        <div className="rounded-md border-1 border-[#e4e4e7] overflow-hidden">
            <GenericTable fallback={<Empty className="flex flex-col gap-2">
                <EmptyMedia variant="icon"><LayoutGridIcon /></EmptyMedia>
                <EmptyTitle>No apps</EmptyTitle>
                <EmptyDescription>Add apps to this configuration.</EmptyDescription>
            </Empty>} table={table} />
        </div>
    </div>
}
