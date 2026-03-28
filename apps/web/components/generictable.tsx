import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { Empty } from "./ui/empty";

export function GenericTable({ table, onRowClick, fallback }: { table: any, onRowClick?: (row: any) => void, fallback?: React.ReactNode }) {
    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id} className="hover:bg-white">
                        {headerGroup.headers.map(header => (
                            <TableHead key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} className="hover:bg-black/5" onClick={() => onRowClick?.(row)}>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
                {table.getRowModel().rows.length === 0 && fallback && (
                    <TableRow className="hover:bg-white">
                        <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                            {fallback}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
