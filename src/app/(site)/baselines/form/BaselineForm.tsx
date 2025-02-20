"use client"

import { saveBaselineAction } from "@/actions/saveBaselineAction"
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { ComboboxWithLabel } from "@/components/inputs/ComboboxWithLabel"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { GetBaseline, ManagerOption, SolutionArchitectOption } from "@/models"
import saveBaselineSchema, { SaveBaselineType } from "@/zod-schemas/baseline"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
// import Link from "next/link"
import { useForm } from "react-hook-form"

type Props = {
    baseline?: GetBaseline
    managers: ManagerOption[]
    solutionArchitects: SolutionArchitectOption[]
}

export function BaselineForm({
    baseline,
    managers,
    solutionArchitects,
}: Props) {
    const { toast } = useToast()

    const months = [
        { id: 1, description: "January" },
        { id: 2, description: "February" },
        { id: 3, description: "March" },
        { id: 4, description: "April" },
        { id: 5, description: "May" },
        { id: 6, description: "June" },
        { id: 7, description: "July" },
        { id: 8, description: "August" },
        { id: 9, description: "September" },
        { id: 10, description: "October" },
        { id: 11, description: "November" },
        { id: 12, description: "December" },
    ]

    const years = [
        { id: 2024, description: "2024" },
        { id: 2025, description: "2025" },
        { id: 2026, description: "2026" },
        { id: 2027, description: "2027" },
        { id: 2028, description: "2028" },
        { id: 2029, description: "2029" },
        { id: 2030, description: "2030" },
    ]

    const defaultValues: SaveBaselineType = {
        baseline_id: baseline?.baseline_id ?? "(New)",
        code: baseline?.code ?? "",
        review: baseline?.review ?? 1,
        title: baseline?.title ?? "",
        description: baseline?.description ?? "",
        start_month: baseline?.start_date.getMonth() ?? 0,
        start_year: baseline?.start_date.getFullYear() ?? 0,
        duration: baseline?.duration ?? 0,
        manager_id: baseline?.manager_id ?? "",
        estimator_id: baseline?.estimator_id ?? "",
    }

    const form = useForm<SaveBaselineType>({
        mode: "onBlur",
        resolver: zodResolver(saveBaselineSchema),
        defaultValues,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveBaselineAction, {
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

    async function submitForm(data: SaveBaselineType) {
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

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    {baseline?.baseline_id ? "Edit" : "New"} Baseline Form
                </h2>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-xs flex-col gap-4">
                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Code"
                            nameInSchema="code"
                        />

                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Review"
                            nameInSchema="review"
                            type="number"
                            step={1}
                            min={1}
                            max={99}
                        />

                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Title"
                            nameInSchema="title"
                        />

                        <TextAreaWithLabel<SaveBaselineType>
                            fieldTitle="Description"
                            nameInSchema="description"
                            className="h-40 max-w-2xl"
                        />
                    </div>

                    <div className="flex w-full max-w-xs flex-col gap-4">
                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Start Month"
                            nameInSchema="start_month"
                            data={months ?? []}
                        />

                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Start Year"
                            nameInSchema="start_year"
                            data={years ?? []}
                        />

                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Duration (months)"
                            nameInSchema="duration"
                            type="number"
                            step={1}
                            min={1}
                            max={99}
                        />
                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Manager"
                            nameInSchema="manager_id"
                            data={managers ?? []}
                        />

                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Solution Architect"
                            nameInSchema="estimator_id"
                            data={solutionArchitects ?? []}
                        />
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
