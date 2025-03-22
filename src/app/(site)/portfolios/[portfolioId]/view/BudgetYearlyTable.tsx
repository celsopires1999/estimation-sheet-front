"use client"
import { FormatDecimal } from "@/components/FormatDecimal"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BudgetTypeYearly, getCostTypeDescription } from "@/models"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { JSX } from "react"

type Props = {
    data: BudgetTypeYearly[]
    total: {
        opex: number
        capex: number
        run: number
    }
}

export function BudgetYearlyTable({ data, total }: Props) {
    const columnHeadersArray: Array<keyof BudgetTypeYearly> = [
        "year",
        "cost_type",
        "amount",
    ]

    const columnDefs: Partial<{
        [K in keyof BudgetTypeYearly]: {
            label: string
            width?: number
            headerRight?: boolean
            transform?: (value: unknown) => string
            presenter?: ({ value }: { value: unknown }) => JSX.Element
        }
    }> = {
        year: { label: "Year", width: 150 },
        cost_type: {
            label: "Type",
            width: 50,
            transform: getCostTypeDescription,
        },
        amount: {
            label: "Amount (BRL)",
            width: 150,
            headerRight: true,
            presenter: FormatDecimal,
        },
    }

    const columnHelper = createColumnHelper<BudgetTypeYearly>()

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
            {/* <div className="overflow-hidden rounded-lg border border-border"> */}
            <div className="max-h-64 overflow-auto rounded-lg border border-border">
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
                    <TableFooter>
                        {total.opex > 0 && (
                            <TableRow>
                                <TableCell colSpan={2}>Total OPEX</TableCell>
                                <TableCell>
                                    <FormatDecimal value={total.opex} />
                                </TableCell>
                            </TableRow>
                        )}

                        {total.capex > 0 && (
                            <TableRow>
                                <TableCell colSpan={2}>Total CAPEX</TableCell>
                                <TableCell>
                                    <FormatDecimal value={total.capex} />
                                </TableCell>
                            </TableRow>
                        )}

                        {total.run > 0 && (
                            <TableRow>
                                <TableCell colSpan={2}>Total RUN</TableCell>
                                <TableCell>
                                    <FormatDecimal value={total.run} />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}
