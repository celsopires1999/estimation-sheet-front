"use client"

import { saveUserAction } from "@/actions/saveUserAction"
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse"
import { InputWithLabel } from "@/components/inputs/InputWithLabel"
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { User, UserType, UserTypeOptions } from "@/models"
import { saveUserSchema, SaveUserType } from "@/zod-schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"

type Props = {
    user?: User
}

export function UserForm({ user }: Props) {
    const { toast } = useToast()

    const defaultValues: SaveUserType = {
        user_id: user?.user_id ?? "(New)",
        user_name: user?.user_name ?? "",
        email: user?.email ?? "",
        name: user?.name ?? "",
        user_type: user?.user_type
            ? (user.user_type as UserType)
            : UserType["Solution Architect"],
    }

    const form = useForm<SaveUserType>({
        mode: "onBlur",
        resolver: zodResolver(saveUserSchema),
        defaultValues,
    })

    const {
        executeAsync: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveUserAction, {
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

    async function submitForm(data: SaveUserType) {
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
                    {user?.user_id ? "Edit" : "New"} Competence
                </h2>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col gap-4 md:flex-row md:gap-8"
                >
                    <div className="flex w-full max-w-lg flex-col gap-4">
                        <InputWithLabel<SaveUserType>
                            fieldTitle="Email"
                            nameInSchema="email"
                            className="max-w-full"
                        />

                        <InputWithLabel<SaveUserType>
                            fieldTitle="User Name"
                            nameInSchema="user_name"
                            className="max-w-full"
                        />

                        <InputWithLabel<SaveUserType>
                            fieldTitle="Name"
                            nameInSchema="name"
                            className="max-w-full"
                        />

                        <SelectWithLabel<SaveUserType>
                            fieldTitle="User Type"
                            nameInSchema="user_type"
                            data={UserTypeOptions}
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
