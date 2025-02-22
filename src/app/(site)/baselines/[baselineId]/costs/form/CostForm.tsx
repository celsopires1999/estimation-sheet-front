"use client"

import { saveCostAction } from "@/actions/saveCostAction"
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel"
import { InputDecimalForArray } from "@/components/inputs/InputDecimalForArray"
import { InputDecimalWithLabel } from "@/components/inputs/InputDecimalWithLabel"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { SelectForArray } from "@/components/inputs/SelectForArray"
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel"
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { toDecimal } from "@/lib/utils"
import {
    CostType,
    CostTypeOptions,
    Currency,
    CurrencyOptions,
    GetBaseline,
    GetCost,
    Tax,
    TaxOptions,
} from "@/models"
import {
    SaveCostAllocationType,
    saveCostSchema,
    SaveCostType,
} from "@/zod-schemas/cost"
import { zodResolver } from "@hookform/resolvers/zod"
import Decimal from "decimal.js"
import { LoaderCircle, Trash } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
// import Link from "next/link"
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form"
import { CostHeader } from "../components/CostHeader"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

type Props = {
    baseline: GetBaseline
    cost?: GetCost
    months: { id: string; description: string }[]
    years: { id: string; description: string }[]
}

export function CostForm({ baseline, cost, years, months }: Props) {
    const { toast } = useToast()
    const [listAllocToggle, setlistAllocToggle] = useState(false)

    const defaultValues: SaveCostType = {
        cost_id: cost?.cost_id ?? "(New)",
        baseline_id: cost?.baseline_id ?? baseline.baseline_id,
        cost_type: cost?.cost_type
            ? (cost.cost_type as CostType)
            : CostType.OTC,
        description: cost?.description ?? "",
        comment: cost?.comment ?? "",
        amount: cost?.amount?.toString() ?? "0.00",
        currency: cost?.currency ? (cost.currency as Currency) : Currency.BRL,
        tax: cost?.tax
            ? (cost.tax.toString() as Tax)
            : Tax["Not Applicable (0%)"],
        apply_inflation: cost?.apply_inflation ?? false,
        cost_allocations: cost?.cost_allocations
            ? cost.cost_allocations.map((alloc) => ({
                  year: alloc.year.toString(),
                  month: alloc.month.toString(),
                  amount: alloc.amount.toString(),
              }))
            : [
                  {
                      year: baseline.start_date.substring(0, 4),
                      month: (+baseline.start_date.substring(5, 7)).toString(),
                      amount: "0.00",
                  },
              ],
    }

    const form = useForm<SaveCostType>({
        mode: "onBlur",
        resolver: zodResolver(saveCostSchema),
        defaultValues,
    })

    const {
        control,
        formState: { errors },
    } = form

    const { fields, append, replace, remove } = useFieldArray({
        name: "cost_allocations",
        control,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveCostAction, {
        onSuccess({ data }) {
            if (data?.message) {
                toast({
                    variant: "default",
                    title: "Success! 🎉",
                    description: data.message,
                })
            }
        },
        // onError({ error }) {
        onError() {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Save Failed",
            })
        },
    })

    async function submitForm(data: SaveCostType) {
        resetSaveAction()
        try {
            await executeSave(data)
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Action error: ${error.message}`,
                })
            }
        }
    }

    const handleAddAllocation = () => {
        const lastIndex = fields.length - 1

        if (lastIndex < 0) {
            append({
                year: baseline.start_date.substring(0, 4),
                month: (+baseline.start_date.substring(5, 7) - 1).toString(),
                amount: "0.00",
            })
            return
        }

        const lastYear = +fields[lastIndex].year
        const lastMonth = +fields[lastIndex].month

        if (lastMonth === 12) {
            append({
                year: (lastYear + 1).toString(),
                month: "1",
                amount: "0.00",
            })
        } else {
            append({
                year: lastYear.toString(),
                month: (lastMonth + 1).toString(),
                amount: "0.00",
            })
        }
    }

    const handleLinearAllocation = () => {
        const amount = form.getValues().amount
        const duration = baseline.duration

        const startYear = +baseline.start_date.substring(0, 4)
        const startMonth = +baseline.start_date.substring(5, 7)

        const monthlyAmount = new Decimal(amount).div(duration).toFixed(0)

        const lastMonth = new Decimal(amount)
            .sub(new Decimal(monthlyAmount).mul(duration))
            .add(new Decimal(monthlyAmount))
            .toFixed(2)

        let year = startYear
        let month = startMonth

        const newCostAllocations: SaveCostAllocationType[] = []

        for (let i = 0; i < duration; i++) {
            if (month === 12) {
                year++
                month = 1
            } else {
                month++
            }

            const alloc = {
                year: year.toString(),
                month: month.toString(),
                amount: i === duration - 1 ? lastMonth : monthlyAmount,
            }

            newCostAllocations.push(alloc)
        }

        replace(newCostAllocations)
        form.trigger("cost_allocations")
    }

    const handleSortAllocation = () => {
        const newValues = [...form.getValues().cost_allocations]

        const sorted = newValues.sort((a, b) => {
            if (a.year === b.year) {
                return +a.month - +b.month
            }
            return +a.year - +b.year
        })

        replace(sorted)
    }

    const TotalAllocated = ({
        control,
    }: {
        control: Control<SaveCostType>
    }) => {
        const costAllocations = useWatch({
            control,
            name: "cost_allocations",
        })

        const currency = useWatch({
            control,
            name: "currency",
        })

        const amount = useWatch({
            control,
            name: "amount",
        })

        if (costAllocations.length === 0) {
            return null
        }

        const total = costAllocations.reduce(
            (acc, item) => new Decimal(acc).add(toDecimal(item.amount)),
            new Decimal(0),
        )

        const formattedValue = new Intl.NumberFormat("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(+total)

        let isAllocated = false

        try {
            isAllocated = new Decimal(amount).eq(total)
        } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {}

        return (
            <span className={!isAllocated ? "text-destructive" : ""}>
                Allocated: {formattedValue} {currency}
            </span>
        )
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <CostHeader
                title={`${cost?.cost_id ? "Edit" : "New"} Cost`}
                baseline={baseline}
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <InputWithLabel<SaveCostType>
                            fieldTitle="Description"
                            nameInSchema="description"
                            className="max-w-full"
                        />

                        <div className="flex items-start justify-start gap-4">
                            <div className="w-1/5">
                                <SelectWithLabel<SaveCostType>
                                    fieldTitle="Cost Type"
                                    nameInSchema="cost_type"
                                    data={CostTypeOptions}
                                    className="max-w-full"
                                />
                            </div>

                            <div className="w-3/5">
                                <InputDecimalWithLabel<SaveCostType>
                                    fieldTitle="Amount"
                                    nameInSchema="amount"
                                    type="number"
                                    step="0.01"
                                    className="max-w-full"
                                />
                            </div>
                            <div className="w-1/5">
                                <SelectWithLabel<SaveCostType>
                                    fieldTitle="Currency"
                                    nameInSchema="currency"
                                    data={CurrencyOptions}
                                    className="max-w-full"
                                />
                            </div>
                        </div>

                        <SelectWithLabel<SaveCostType>
                            fieldTitle="Importing Tax"
                            nameInSchema="tax"
                            data={TaxOptions}
                            className="max-w-full"
                        />

                        <CheckboxWithLabel<SaveCostType>
                            fieldTitle="Inflation?"
                            nameInSchema="apply_inflation"
                            message="Yes"
                            className="max-w-xs"
                        />
                        <TextAreaWithLabel<SaveCostType>
                            fieldTitle="Comment"
                            nameInSchema="comment"
                            className="h-40 max-w-full"
                        />
                    </div>

                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">
                                    Cost Allocations
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="listAllocToggle"
                                        checked={listAllocToggle}
                                        onCheckedChange={() =>
                                            setlistAllocToggle(!listAllocToggle)
                                        }
                                    />
                                    <Label
                                        htmlFor="listAllocToggle"
                                        className="font-semibold"
                                    >
                                        List
                                    </Label>
                                </div>
                            </div>
                            <Card>
                                {/* <CardHeader className="space-y-0 p-2"> */}
                                <CardHeader>
                                    <CardTitle>
                                        <TotalAllocated control={control} />
                                    </CardTitle>
                                </CardHeader>

                                {listAllocToggle && (
                                    <>
                                        <CardContent className="max-h-80 space-y-4 overflow-y-auto">
                                            <div className="flex items-start justify-start gap-4">
                                                <div className="w-3/12">
                                                    <Label className="text-base font-semibold">
                                                        Year
                                                    </Label>
                                                </div>
                                                <div className="w-4/12">
                                                    <Label className="text-base font-semibold">
                                                        Month
                                                    </Label>
                                                </div>
                                                <div className="w-4/12">
                                                    <Label className="text-base font-semibold">
                                                        Amount
                                                    </Label>
                                                </div>
                                                <div className="w-1/12"></div>
                                            </div>
                                            {fields.map((field, index) => {
                                                return (
                                                    <div
                                                        key={field.id}
                                                        className="flex items-start justify-start gap-4"
                                                    >
                                                        <div className="w-3/12">
                                                            <SelectForArray<SaveCostAllocationType>
                                                                nameInSchema="year"
                                                                data={
                                                                    years ?? []
                                                                }
                                                                className="max-w-full"
                                                                fieldArrayName={`cost_allocations.${index}.year`}
                                                            />
                                                        </div>
                                                        <div className="w-4/12">
                                                            <SelectForArray<SaveCostAllocationType>
                                                                nameInSchema="month"
                                                                data={
                                                                    months ?? []
                                                                }
                                                                className="max-w-full"
                                                                fieldArrayName={`cost_allocations.${index}.month`}
                                                            />
                                                        </div>
                                                        <div className="w-4/12">
                                                            <InputDecimalForArray<SaveCostAllocationType>
                                                                nameInSchema="amount"
                                                                type="number"
                                                                step="0.01"
                                                                className="max-w-full"
                                                                fieldArrayName={`cost_allocations.${index}.amount`}
                                                            />
                                                        </div>

                                                        {index === 0 ? (
                                                            <div className="w-1/12"></div>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <Trash />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </CardContent>

                                        <CardFooter>
                                            <div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Add Allocation"
                                                        onClick={() =>
                                                            handleAddAllocation()
                                                        }
                                                    >
                                                        Add
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Sort"
                                                        onClick={() =>
                                                            handleLinearAllocation()
                                                        }
                                                    >
                                                        Linear
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Sort"
                                                        onClick={() =>
                                                            handleSortAllocation()
                                                        }
                                                    >
                                                        Sort
                                                    </Button>
                                                </div>
                                                <p className="mt-4 text-sm text-destructive">
                                                    {
                                                        errors.cost_allocations
                                                            ?.root?.message
                                                    }
                                                </p>
                                            </div>
                                        </CardFooter>
                                    </>
                                )}
                            </Card>
                        </div>
                        <div className="flex max-w-xs gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />{" "}
                                        Saving
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset(defaultValues)
                                    resetSaveAction()
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
