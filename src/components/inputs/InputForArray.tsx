"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { InputHTMLAttributes } from "react"

type Props<Schema> = {
    nameInSchema: keyof Schema & string
    className?: string
    fieldArrayName?: string
} & InputHTMLAttributes<HTMLInputElement>

export function InputForArray<Schema>({
    nameInSchema,
    className,
    fieldArrayName,
    ...props
}: Props<Schema>) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={fieldArrayName ?? nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input
                            id={fieldArrayName ?? nameInSchema}
                            className={`w-full max-w-xs disabled:text-blue-500 disabled:opacity-75 dark:disabled:text-yellow-300 ${className}`}
                            {...props}
                            {...field}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
