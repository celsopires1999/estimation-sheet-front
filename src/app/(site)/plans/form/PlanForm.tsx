"use client"

import { savePlanAction } from "@/actions/savePlanAction"
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Currency, Plan } from "@/models"
import { savePlanSchema, SavePlanType } from "@/zod-schemas/plan"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { Assumptions } from "./Assumptions"

type Props = {
    plan?: Plan
    copy?: boolean
}

export function PlanForm({ plan, copy }: Props) {
    const { toast } = useToast()

    const defaultValues: SavePlanType = {
        plan_id: plan?.plan_id ? (copy ? "(New)" : plan.plan_id) : "(New)",
        code: plan?.code ?? "",
        name: plan?.name ?? "",
        is_preview: plan?.is_preview ?? false,
        assumptions: plan?.assumptions
            ? plan.assumptions.map((a) => ({
                  year: a.year.toString(),
                  inflation: a.inflation.toString(),
                  currencies: a.currencies.map((c) => ({
                      currency: c.currency as Currency,
                      exchange: c.exchange.toString(),
                  })),
              }))
            : [
                  {
                      year: "2023",
                      inflation: "0.00",
                      currencies: [
                          { currency: Currency.USD, exchange: "0.00" },
                          { currency: Currency.EUR, exchange: "0.00" },
                      ],
                  },
              ],
    }

    const form = useForm<SavePlanType>({
        mode: "onBlur",
        resolver: zodResolver(savePlanSchema),
        defaultValues,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(savePlanAction, {
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

    async function submitForm(data: SavePlanType) {
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
                    {plan?.plan_id ? (copy ? "Copy" : "Edit") : "New"} Plan
                </h2>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full flex-col gap-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="w-2/3">
                                <InputWithLabel<SavePlanType>
                                    fieldTitle="Code"
                                    nameInSchema="code"
                                    className="max-w-xl"
                                />
                            </div>

                            <div className="w-1/3">
                                <CheckboxWithLabel<SavePlanType>
                                    fieldTitle="Preview?"
                                    nameInSchema="is_preview"
                                    message="Yes"
                                    className="max-w-xs"
                                />
                            </div>
                        </div>

                        <InputWithLabel<SavePlanType>
                            fieldTitle="Name"
                            nameInSchema="name"
                            className="max-w-full"
                        />

                        <Assumptions />

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
