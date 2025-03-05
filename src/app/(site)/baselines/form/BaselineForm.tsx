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
import { saveBaselineSchema, SaveBaselineType } from "@/zod-schemas/baseline"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronRight, LoaderCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useForm } from "react-hook-form"

type Props = {
    baseline?: GetBaseline
    managers: ManagerOption[]
    solutionArchitects: SolutionArchitectOption[]
    months: { id: string; description: string }[]
    years: { id: string; description: string }[]
}

export function BaselineForm({
    baseline,
    managers,
    solutionArchitects,
    years,
    months,
}: Props) {
    const { toast } = useToast()

    const defaultValues: SaveBaselineType = {
        baseline_id: baseline?.baseline_id ?? "(New)",
        code: baseline?.code ?? "",
        review: baseline?.review ?? 1,
        title: baseline?.title ?? "",
        description: baseline?.description ?? "",
        start_year: baseline ? baseline.start_date.substring(0, 4) : "0",
        start_month: baseline
            ? (+baseline.start_date.substring(5, 7)).toString()
            : "0",
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

    const baselineId = baseline?.baseline_id ?? saveResult.data?.baseline_id

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <DisplayServerActionResponse result={saveResult} />
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    {baseline?.baseline_id ? "Edit" : "New"} Baseline
                </h2>
                {baselineId && (
                    <div className="flex">
                        <Button variant="ghost" asChild>
                            <Link
                                href={`/baselines/${baselineId}/costs`}
                                className="flex w-full"
                                prefetch={false}
                            >
                                <span>Costs</span>{" "}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        <Button variant="ghost" asChild>
                            <Link
                                href={`/baselines/${baselineId}/efforts`}
                                className="flex w-full"
                                prefetch={false}
                            >
                                <span>Efforts</span>{" "}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>

                        <Button variant="ghost" asChild>
                            <Link
                                href={`/portfolios/baselines/${baselineId}`}
                                className="flex w-full"
                                prefetch={false}
                            >
                                <span>Portfolios</span>{" "}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="w-2/3">
                                <InputWithLabel<SaveBaselineType>
                                    fieldTitle="Code"
                                    nameInSchema="code"
                                />
                            </div>
                            <div className="w-1/3">
                                <InputWithLabel<SaveBaselineType>
                                    fieldTitle="Review"
                                    nameInSchema="review"
                                    type="number"
                                    step={1}
                                    min={1}
                                    max={99}
                                />
                            </div>
                        </div>

                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Title"
                            nameInSchema="title"
                            className="max-w-full"
                        />

                        <TextAreaWithLabel<SaveBaselineType>
                            fieldTitle="Description"
                            nameInSchema="description"
                            className="h-40 max-w-full"
                        />
                    </div>

                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="w-1/2">
                                <ComboboxWithLabel<SaveBaselineType>
                                    fieldTitle="Start Year"
                                    nameInSchema="start_year"
                                    data={years ?? []}
                                    className="max-w-full"
                                />
                            </div>
                            <div className="w-1/2">
                                <ComboboxWithLabel<SaveBaselineType>
                                    fieldTitle="Start Month"
                                    nameInSchema="start_month"
                                    data={months ?? []}
                                    className="max-w-full"
                                />
                            </div>
                        </div>
                        <InputWithLabel<SaveBaselineType>
                            fieldTitle="Duration (months)"
                            nameInSchema="duration"
                            type="number"
                            step={1}
                            min={1}
                            max={99}
                            className="max-w-full"
                        />
                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Manager"
                            nameInSchema="manager_id"
                            data={managers ?? []}
                            className="max-w-full"
                        />

                        <ComboboxWithLabel<SaveBaselineType>
                            fieldTitle="Solution Architect"
                            nameInSchema="estimator_id"
                            data={solutionArchitects ?? []}
                            className="max-w-full"
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
