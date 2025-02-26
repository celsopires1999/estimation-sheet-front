"use client"

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import { useFormContext } from "react-hook-form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DataObj = {
    id: string
    description: string
}

type Props<Schema> = {
    nameInSchema: keyof Schema & string
    data: DataObj[]
    className?: string
    fieldArrayName?: string
}

export function SelectForArray<Schema>({
    nameInSchema,
    data,
    className,
    fieldArrayName,
}: Props<Schema>) {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={fieldArrayName ?? nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <Select {...field} onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger
                                id={fieldArrayName ?? nameInSchema}
                                className={`w-full max-w-xs ${className}`}
                            >
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                            {data.map((item) => (
                                <SelectItem
                                    key={`${fieldArrayName ?? nameInSchema}_${item.id}`}
                                    value={item.id}
                                >
                                    {item.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
