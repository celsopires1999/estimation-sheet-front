import { Input } from "@/components/ui/input"
import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"

type Props<Schema> = {
    // fieldTitle: string
    nameInSchema: keyof Schema & string
    className?: string
    fieldArrayName?: string
} & InputHTMLAttributes<HTMLInputElement>

export function InputDecimalForArray<Schema>({
    // fieldTitle,
    nameInSchema,
    className,
    fieldArrayName,
    ...props
}: Props<Schema>) {
    const form = useFormContext()
    const [isEditing, setIsEditing] = useState(false)

    const formatter = (value: string) => {
        if (!value) {
            return ""
        }
        const val = value.replace(",", ".")
        if (isNaN(+val)) {
            return value
        }

        return new Intl.NumberFormat("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 9,
        }).format(+val)
    }

    const [formattedValue, setFormattedValue] = useState(
        formatter(form.getValues(fieldArrayName ?? nameInSchema)),
    )

    const secondInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setFormattedValue(
            formatter(form.getValues(fieldArrayName ?? nameInSchema)),
        )
    }, [form.getValues(fieldArrayName ?? nameInSchema)]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isEditing) {
            secondInputRef.current?.select()
        }
    }, [isEditing])

    return (
        <FormField
            control={form.control}
            name={fieldArrayName ?? nameInSchema}
            render={({ field }) => (
                <FormItem>
                    {/* <FormLabel
                        className="text-base font-semibold"
                        htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel> */}

                    {!isEditing && (
                        <Input
                            id={`${nameInSchema}-formatted`}
                            className={`w-full max-w-xs disabled:text-blue-500 disabled:opacity-75 dark:disabled:text-yellow-300 ${className}`}
                            {...props}
                            value={formattedValue}
                            onSelect={() => setIsEditing(true)}
                            readOnly
                            type="text"
                        />
                    )}

                    <FormControl>
                        {isEditing && (
                            <Input
                                id={nameInSchema}
                                className={`w-full max-w-xs disabled:text-blue-500 disabled:opacity-75 dark:disabled:text-yellow-300 ${className}`}
                                {...props}
                                {...field}
                                onBlur={() => {
                                    field.onBlur()
                                    setIsEditing(false)
                                }}
                                ref={secondInputRef}
                            />
                        )}
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
