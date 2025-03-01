import { InputDecimalForArray } from "@/components/inputs/InputDecimalForArray"
import { SelectForArray } from "@/components/inputs/SelectForArray"
import { Currency, CurrencyOptions } from "@/models"
import { SaveCurrencyAssumptionType } from "@/zod-schemas/plan"
import { useFieldArray, useFormContext } from "react-hook-form"

export function Currencies({ nestIndex }: { nestIndex: number }) {
    const form = useFormContext()

    const { control } = form

    const { fields } = useFieldArray({
        name: `assumptions.${nestIndex}.currencies`,
        control,
    })

    const currencies = CurrencyOptions.filter((c) => c.id !== Currency.BRL)

    return (
        <div className="flex w-7/12 justify-between gap-4">
            {fields.map((item, k) => (
                <div key={item.id} className="flex gap-4">
                    <SelectForArray<SaveCurrencyAssumptionType>
                        nameInSchema="currency"
                        data={currencies ?? []}
                        className="min-w-24"
                        fieldArrayName={`assumptions.${nestIndex}.currencies.${k}.currency`}
                    />
                    <InputDecimalForArray<SaveCurrencyAssumptionType>
                        nameInSchema="exchange"
                        type="number"
                        step="0.01"
                        className="max-w-full"
                        fieldArrayName={`assumptions.${nestIndex}.currencies.${k}.exchange`}
                    />
                </div>
            ))}
        </div>
    )
}
