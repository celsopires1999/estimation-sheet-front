"use client"
import { FormatDecimal } from "@/components/FormatDecimal"
import { Filter } from "@/components/react-table/Filter"
import { NoFilter } from "@/components/react-table/NoFilter"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTableStateHelper } from "@/hooks/useTableStateHelper"
import { Budget, getCostTypeDescription } from "@/models"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { JSX, useEffect } from "react"

type Props = {
    data: Budget[]
}

export function BudgetTable({ data }: Props) {
    const router = useRouter()

    const searchParams = useSearchParams()

    const [
        filterToggle,
        pageIndex,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        handleFilterToggle,
        handlePage,
        handlePagination,
        handleSorting,
        handleColumnFilters,
    ] = useTableStateHelper()

    const handleFilterToggleChange = (checked: boolean) => {
        if (!checked) {
            table.resetColumnFilters()
        }

        handleFilterToggle(checked)
    }

    const columnHeadersArray: Array<keyof Budget> = [
        "description",
        "cost_type",
        "amount",
    ]

    const columnDefs: Partial<{
        [K in keyof Budget]: {
            label: string
            width?: number
            filterable?: boolean
            headerRight?: boolean
            transform?: (value: unknown) => string
            presenter?: ({ value }: { value: unknown }) => JSX.Element
        }
    }> = {
        description: { label: "Description", width: 500, filterable: true },
        cost_type: {
            label: "Type",
            width: 50,
            filterable: true,
            transform: getCostTypeDescription,
        },
        amount: {
            label: "Amount (BRL)",
            width: 100,
            filterable: false,
            headerRight: true,
            presenter: FormatDecimal,
        },
    }

    const columnHelper = createColumnHelper<Budget>()

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
                enableColumnFilter:
                    columnDefs[columnName as keyof typeof columnDefs]
                        ?.filterable ?? false,
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            className="flex w-full justify-between pl-1"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc",
                                )
                            }
                        >
                            {
                                columnDefs[
                                    columnName as keyof typeof columnDefs
                                ]?.label
                            }
                            {column.getIsSorted() === "asc" && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}

                            {column.getIsSorted() === "desc" && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}

                            {/* {column.getIsSorted() !== "desc" &&
                                        column.getIsSorted() !== "asc" && (
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        )} */}
                        </Button>
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
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex,
                pageSize: 100,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
    })

    const handlePageChange = (direction: "previous" | "next") => {
        table.setPageIndex(handlePage(table.getState().pagination, direction))
    }

    useEffect(() => {
        handlePagination(table.getState().pagination, table.getPageCount())
    }, [table.getState().pagination]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleSorting(table.getState().sorting)
    }, [table.getState().sorting]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleColumnFilters(table.getState().columnFilters)
    }, [table.getState().columnFilters]) // eslint-disable-line react-hooks/exhaustive-deps

    const calculateFilteredTotal = () => {
        return table.getFilteredRowModel().rows.reduce((total, row) => {
            const amount = row.getValue("amount") as number
            return total + (amount || 0)
        }, 0)
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div className="flex items-center justify-between">
                <h2 className="text-base">Budget Items</h2>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="filterToggle"
                        checked={filterToggle}
                        onCheckedChange={handleFilterToggleChange}
                    />
                    <Label htmlFor="filterToggle" className="font-semibold">
                        Filter
                    </Label>
                </div>
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
                                        {filterToggle ? (
                                            header.column.getCanFilter() ? (
                                                <div className="grid w-max place-content-center">
                                                    <Filter
                                                        column={header.column}
                                                        filteredRows={table
                                                            .getFilteredRowModel()
                                                            .rows.map((row) =>
                                                                row.getValue(
                                                                    header
                                                                        .column
                                                                        .id,
                                                                ),
                                                            )}
                                                    />
                                                </div>
                                            ) : header.id ===
                                              "actions" ? null : (
                                                <NoFilter />
                                            )
                                        ) : null}
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
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "decimal",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(+calculateFilteredTotal())}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1">
                <div>
                    <p className="whitespace-nowrap font-bold">
                        {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(1, table.getPageCount())}`}
                        &nbsp;&nbsp;
                        {`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"}]`}
                    </p>
                </div>
                <div className="flex flex-row gap-1">
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="outline"
                            onClick={() => router.refresh()}
                        >
                            Refresh Data
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.resetSorting()}
                        >
                            Reset Sorting
                        </Button>
                        {filterToggle && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    table.resetColumnFilters()
                                    const params = new URLSearchParams(
                                        searchParams.toString(),
                                    )
                                    params.delete("filter")
                                    router.replace(`?${params.toString()}`, {
                                        scroll: false,
                                    })
                                }}
                            >
                                Reset Filters
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange("previous")}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handlePageChange("next")}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
