"use client"

import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
// import Link from "next/link"
import { createPortfolioAction } from "@/actions/createPortfolioAction"
import { ComboboxWithLabel } from "@/components/inputs/ComboboxWithLabel"
import { GetBaseline, PreliminaryPlanOption } from "@/models"
import {
    CreatePortfolioType,
    createPortfolioSchema,
} from "@/zod-schemas/portfolio"
import { useForm } from "react-hook-form"
import { PreliminaryHeader } from "../components/PreliminaryHeader"

type Props = {
    baseline: GetBaseline
    plans: PreliminaryPlanOption[]
}

export function PreliminaryForm({ baseline, plans }: Props) {
    const { toast } = useToast()

    const defaultValues: CreatePortfolioType = {
        baseline_id: baseline.baseline_id,
        plan_id: "",
        shift_months: 1,
    }

    const form = useForm<CreatePortfolioType>({
        mode: "onBlur",
        resolver: zodResolver(createPortfolioSchema),
        defaultValues,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(createPortfolioAction, {
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

    async function submitForm(data: CreatePortfolioType) {
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
            <PreliminaryHeader
                title="New Preliminary"
                baseline={baseline}
                children
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <ComboboxWithLabel<CreatePortfolioType>
                            fieldTitle="Plan"
                            nameInSchema="plan_id"
                            data={plans ?? []}
                            className="max-w-full"
                        />

                        <InputWithLabel<CreatePortfolioType>
                            fieldTitle="Shift Months"
                            nameInSchema="shift_months"
                            type="number"
                            step={1}
                            min={1}
                            max={999_999}
                            className="max-w-full"
                        />
                    </div>

                    <div className="flex w-full max-w-lg flex-col gap-4">
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
