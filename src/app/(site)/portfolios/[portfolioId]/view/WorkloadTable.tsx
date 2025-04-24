"use client"
import { FormatInteger } from "@/components/FormatInteger"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Workload } from "@/models"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { JSX } from "react"

type Props = {
    data: Workload[]
}

export function WorkloadTable({ data }: Props) {
    const columnHeadersArray: Array<keyof Workload> = [
        "competence_code",
        "hours",
        "comment",
    ]

    const columnDefs: Partial<{
        [K in keyof Workload]: {
            label: string
            width?: number
            headerRight?: boolean
            transform?: (value: unknown) => string
            presenter?: ({ value }: { value: unknown }) => JSX.Element
        }
    }> = {
        competence_code: { label: "Competence", width: 150 },
        hours: {
            label: "Hours",
            width: 100,
            headerRight: true,
            presenter: FormatInteger,
        },
        comment: { label: "Comment", width: 500 },
    }

    const columnHelper = createColumnHelper<Workload>()

    const columns = columnHeadersArray.map((columnName) => {
        return columnHelper.accessor(
            (row) => {
                // transformational
                const value = row[columnName]
                const transformFn =
                    columnDefs[columnName as keyof typeof columnDefs]?.transform
                if (transformFn) {
                    return transformFn(value)
                }

                return value
            },
            {
                id: columnName,
                size:
                    columnDefs[columnName as keyof typeof columnDefs]?.width ??
                    undefined,
                header: () => {
                    const className = columnDefs[
                        columnName as keyof typeof columnDefs
                    ]?.headerRight
                        ? "text-right"
                        : ""

                    return (
                        // <div className="flex h-9 w-full cursor-default items-center justify-between gap-2 whitespace-nowrap rounded-md px-4 py-2 pl-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                        <div
                            className={`h-9 cursor-default whitespace-nowrap rounded-md px-4 py-2 pl-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${className}`}
                        >
                            {
                                columnDefs[
                                    columnName as keyof typeof columnDefs
                                ]?.label
                            }
                        </div>
                    )
                },
                cell: (info) => {
                    // presentational
                    const presenterFn =
                        columnDefs[columnName as keyof typeof columnDefs]
                            ?.presenter

                    return (
                        <>
                            {presenterFn ? (
                                presenterFn({ value: info.getValue() })
                            ) : (
                                <div>{info.getValue()?.toString()}</div>
                            )}
                        </>
                    )
                },
            },
        )
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div className="flex items-center justify-between">
                <h2 className="text-base">Workload Items</h2>
            </div>
            {/* <div className="overflow-hidden rounded-lg border border-border"> */}
            <div className="max-h-80 overflow-auto rounded-lg border border-border">
                <Table className="border">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`bg-secondary font-semibold ${header.id === "actions" ? "w-12" : ""}`}
                                        style={
                                            header.id !== "actions"
                                                ? {
                                                      width: header.getSize(),
                                                  }
                                                : undefined
                                        }
                                    >
                                        <div
                                            className={`${header.id === "actions" ? "flex items-center justify-center" : ""}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-border/25 dark:hover:bg-ring/40"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
