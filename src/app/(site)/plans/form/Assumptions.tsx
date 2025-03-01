import { InputDecimalForArray } from "@/components/inputs/InputDecimalForArray"
import { SelectForArray } from "@/components/inputs/SelectForArray"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { YearsOptions } from "@/data"
import { Currency } from "@/models"
import { SaveAssumptionType } from "@/zod-schemas/plan"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Currencies } from "./Currencies"
import { RemoveAssumption } from "./RemoveAssumption"

export function Assumptions() {
    const form = useFormContext()

    const {
        control,
        formState: { errors },
    } = form

    const { fields, append, replace, remove } = useFieldArray({
        name: "assumptions",
        control,
    })

    const years = YearsOptions

    const handleAddAssumption = () => {
        const lastIndex = fields.length - 1
        const assumptions = fields as unknown as SaveAssumptionType[]

        append({
            year: (+assumptions[lastIndex].year + 1).toString(),
            inflation: "0.00",
            currencies: [
                { currency: Currency.USD, exchange: "0.00" },
                { currency: Currency.EUR, exchange: "0.00" },
            ],
        })
    }

    const handleSortAssumption = () => {
        const newValues = [...form.getValues().assumptions]

        const sorted = newValues.sort((a, b) => {
            return +a.year - +b.year
        })

        replace(sorted)
    }

    const ShowErrors = () => {
        let message = ""

        if (errors.assumptions && Array.isArray(errors.assumptions)) {
            for (const error of errors.assumptions) {
                if (typeof error?.currencies?.root?.message === "string") {
                    message = errors.assumptions
                        .map((error) => error.currencies?.root?.message)
                        .join(", ")
                }
            }
        }
        return <p className="mt-4 text-sm text-destructive">{message}</p>
    }

    return (
        <>
            <div className="space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Assumptions</CardTitle>
                    </CardHeader>

                    <>
                        <CardContent className="max-h-80 space-y-4 overflow-y-auto">
                            <div className="flex items-start justify-start gap-4">
                                <div className="w-2/12">
                                    <Label className="text-base font-semibold">
                                        Year
                                    </Label>
                                </div>
                                <div className="w-2/12">
                                    <Label className="text-base font-semibold">
                                        Inflation
                                    </Label>
                                </div>
                                <div className="w-7/12">
                                    <Label className="text-base font-semibold">
                                        Exchange Rates
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
                                        <div className="w-2/12">
                                            <SelectForArray<SaveAssumptionType>
                                                nameInSchema="year"
                                                data={years ?? []}
                                                className="max-w-full"
                                                fieldArrayName={`assumptions.${index}.year`}
                                            />
                                        </div>

                                        <div className="w-2/12">
                                            <InputDecimalForArray<SaveAssumptionType>
                                                nameInSchema="inflation"
                                                type="number"
                                                step="0.01"
                                                className="max-w-full"
                                                fieldArrayName={`assumptions.${index}.inflation`}
                                            />
                                        </div>

                                        <Currencies nestIndex={index} />

                                        {index === 0 ? (
                                            <div className="w-1/12"></div>
                                        ) : (
                                            <div className="w-1/12">
                                                <RemoveAssumption
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                />
                                            </div>
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
                                        onClick={() => handleAddAssumption()}
                                    >
                                        Add
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        title="Sort"
                                        onClick={() => handleSortAssumption()}
                                    >
                                        Sort
                                    </Button>
                                </div>
                                <ShowErrors />
                            </div>
                        </CardFooter>
                    </>
                </Card>
            </div>
        </>
    )
}
