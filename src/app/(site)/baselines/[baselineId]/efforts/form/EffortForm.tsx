"use client"

import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { SelectForArray } from "@/components/inputs/SelectForArray"
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
import { CompetenceOption, GetBaseline, GetEffort } from "@/models"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, Trash } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
// import Link from "next/link"
import { saveEffortAction } from "@/actions/saveEffortAction"
import { ComboboxWithLabel } from "@/components/inputs/ComboboxWithLabel"
import { InputForArray } from "@/components/inputs/InputForArray"
import { Switch } from "@/components/ui/switch"
import {
    SaveEffortAllocationType,
    saveEffortSchema,
    SaveEffortType,
} from "@/zod-schemas/effort"
import { useState } from "react"
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form"
import { EffortHeader } from "../components/EffortHeader"

type Props = {
    baseline: GetBaseline
    effort?: GetEffort
    competences: CompetenceOption[]
    months: { id: string; description: string }[]
    years: { id: string; description: string }[]
}

export function EffortForm({
    baseline,
    effort,
    competences,
    years,
    months,
}: Props) {
    const { toast } = useToast()
    const [listAllocToggle, setlistAllocToggle] = useState(false)

    const defaultValues: SaveEffortType = {
        effort_id: effort?.effort_id ?? "(New)",
        baseline_id: effort?.baseline_id ?? baseline.baseline_id,
        competence_id: effort?.competence_id ?? "",
        comment: effort?.comment ?? "",
        hours: effort?.hours?.toString() ?? "0",
        effort_allocations: effort?.effort_allocations
            ? effort.effort_allocations.map((alloc) => ({
                  year: alloc.year.toString(),
                  month: alloc.month.toString(),
                  hours: alloc.hours.toString(),
              }))
            : [
                  {
                      year: baseline.start_date.substring(0, 4),
                      month: (+baseline.start_date.substring(5, 7)).toString(),
                      hours: "0",
                  },
              ],
    }

    const form = useForm<SaveEffortType>({
        mode: "onBlur",
        resolver: zodResolver(saveEffortSchema),
        defaultValues,
    })

    const {
        control,
        formState: { errors },
    } = form

    const { fields, append, replace, remove } = useFieldArray({
        name: "effort_allocations",
        control,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveEffortAction, {
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

    async function submitForm(data: SaveEffortType) {
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
                hours: "0",
            })
            return
        }

        const lastYear = +fields[lastIndex].year
        const lastMonth = +fields[lastIndex].month

        if (lastMonth === 12) {
            append({
                year: (lastYear + 1).toString(),
                month: "1",
                hours: "0",
            })
        } else {
            append({
                year: lastYear.toString(),
                month: (lastMonth + 1).toString(),
                hours: "0",
            })
        }
    }

    const handleLinearAllocation = () => {
        const hours = +form.getValues().hours
        const duration = baseline.duration

        const startYear = +baseline.start_date.substring(0, 4)
        const startMonth = +baseline.start_date.substring(5, 7)

        const monthlyHours = Math.floor(hours / duration)

        const lastMonth = hours - monthlyHours * duration + monthlyHours

        let year = startYear
        let month = startMonth

        const newEffortAllocations: SaveEffortAllocationType[] = []

        for (let i = 0; i < duration; i++) {
            const alloc = {
                year: year.toString(),
                month: month.toString(),
                hours: i === duration - 1 ? lastMonth : monthlyHours,
            }

            newEffortAllocations.push(alloc)

            if (month === 12) {
                year++
                month = 1
            } else {
                month++
            }
        }

        replace(newEffortAllocations)
        form.trigger("effort_allocations")
    }

    const handleSortAllocation = () => {
        const newValues = [...form.getValues().effort_allocations]

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
        control: Control<SaveEffortType>
    }) => {
        const effortAllocations = useWatch({
            control,
            name: "effort_allocations",
        })

        const hours = useWatch({
            control,
            name: "hours",
        })

        if (effortAllocations.length === 0) {
            return null
        }

        const total = effortAllocations.reduce(
            (acc, item) => acc + +item.hours,
            0,
        )

        const formattedValue = new Intl.NumberFormat("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(+total)

        let isAllocated = false

        try {
            isAllocated = +hours === total
        } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {}

        return (
            <span className={!isAllocated ? "text-destructive" : ""}>
                Allocated: {formattedValue} hours
            </span>
        )
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <EffortHeader
                title={`${effort?.effort_id ? "Edit" : "New"} Effort`}
                baseline={baseline}
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <ComboboxWithLabel<SaveEffortType>
                            fieldTitle="Competence"
                            nameInSchema="competence_id"
                            data={competences ?? []}
                            className="max-w-full"
                        />

                        <InputWithLabel<SaveEffortType>
                            fieldTitle="Hours"
                            nameInSchema="hours"
                            type="number"
                            step={1}
                            min={1}
                            max={999_999}
                            className="max-w-full"
                        />

                        <TextAreaWithLabel<SaveEffortType>
                            fieldTitle="Comment"
                            nameInSchema="comment"
                            className="h-40 max-w-full"
                        />
                    </div>

                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">
                                    Effort Allocations
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
                                                        Hours
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
                                                            <SelectForArray<SaveEffortAllocationType>
                                                                nameInSchema="year"
                                                                data={
                                                                    years ?? []
                                                                }
                                                                className="max-w-full"
                                                                fieldArrayName={`effort_allocations.${index}.year`}
                                                            />
                                                        </div>
                                                        <div className="w-4/12">
                                                            <SelectForArray<SaveEffortAllocationType>
                                                                nameInSchema="month"
                                                                data={
                                                                    months ?? []
                                                                }
                                                                className="max-w-full"
                                                                fieldArrayName={`effort_allocations.${index}.month`}
                                                            />
                                                        </div>
                                                        <div className="w-4/12">
                                                            <InputForArray<SaveEffortAllocationType>
                                                                nameInSchema="hours"
                                                                type="number"
                                                                step={1}
                                                                min={1}
                                                                max={99_999}
                                                                className="max-w-full"
                                                                fieldArrayName={`effort_allocations.${index}.hours`}
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
                                                        errors
                                                            .effort_allocations
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
