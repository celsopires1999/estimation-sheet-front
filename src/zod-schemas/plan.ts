import {
    isGreaterThanZero,
    isValidDecimalWithPrecision,
    isValidNumber,
} from "@/lib/utils"
import { Currency } from "@/models"
import { z } from "zod"

export const saveCurrencyAssumptionSchema = z.object({
    currency: z.nativeEnum(Currency, {
        errorMap: () => ({ message: "Invalid currency" }),
    }),
    exchange: z
        .string()
        .refine(
            (value) => {
                const decimalValue = value.replace(",", ".")
                return isValidDecimalWithPrecision(decimalValue, 12, 2)
            },
            {
                message: "Invalid exchange",
            },
        )
        .refine((value) => isGreaterThanZero(value), {
            message: "Exchange must be greater than zero",
        })
        .transform((value) => value.replace(",", ".")),
})

export const saveAssumptionSchema = z.object({
    year: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 2023, 2030), {
            message: "Invalid year",
        }),
    inflation: z
        .string()
        .refine(
            (value) => {
                const decimalValue = value.replace(",", ".")
                return isValidDecimalWithPrecision(decimalValue, 12, 2)
            },
            {
                message: "Invalid inflation",
            },
        )
        .refine((value) => isGreaterThanZero(value), {
            message: "Inflation must be greater than zero",
        })
        .transform((value) => value.replace(",", ".")),
    currencies: z
        .array(saveCurrencyAssumptionSchema)
        .min(1, "At least one cost allocation is required")
        .refine((currencies) => {
            const uniqueCurrencies = new Set(currencies.map((c) => c.currency))
            return uniqueCurrencies.size === currencies.length
        }, "Duplicate currency in currencies list"),
})

export const savePlanSchema = z.object({
    plan_id: z.union([z.string().uuid("invalid Plan Id"), z.literal("(New)")]),
    code: z
        .string()
        .min(1, "Code is required")
        .max(10, "Code max length is 10 characters"),
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name max length is 50 characters"),
    is_preview: z.boolean(),
    assumptions: z
        .array(saveAssumptionSchema)
        .min(1, "At least one assumption is required")
        .refine((assumptions) => {
            const uniqueAssumptions = new Set(assumptions.map((a) => a.year))
            return uniqueAssumptions.size === assumptions.length
        }, "Duplicate year in assumptions"),
})

export type SavePlanType = z.infer<typeof savePlanSchema>
export type SaveAssumptionType = z.infer<typeof saveAssumptionSchema>
export type SaveCurrencyAssumptionType = z.infer<
    typeof saveCurrencyAssumptionSchema
>
