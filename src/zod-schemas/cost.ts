import {
    isGreaterThanOrEqualToZero,
    isGreaterThanZero,
    isValidDecimalWithPrecision,
    isValidNumber,
} from "@/lib/utils"
import { CostType, Currency, Tax } from "@/models"
import { z } from "zod"

export const saveCostAllocationSchema = z.object({
    year: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 2023, 2030), {
            message: "Invalid year",
        }),
    month: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 1, 12), {
            message: "Invalid month",
        }),
    amount: z
        .string()
        .refine(
            (value) => {
                const decimalValue = value.replace(",", ".")
                return isValidDecimalWithPrecision(decimalValue, 12, 2)
            },
            {
                message: "Invalid amount",
            },
        )
        .refine((value) => isGreaterThanZero(value), {
            message: "Amount must be greater than zero",
        })
        .transform((value) => value.replace(",", ".")),
})

export const saveCostSchema = z.object({
    cost_id: z.union([z.string().uuid("invalid Cost Id"), z.literal("(New)")]),
    baseline_id: z.string().uuid("invalid Baseline Id"),
    cost_type: z.nativeEnum(CostType, {
        errorMap: () => ({ message: "Invalid cost type" }),
    }),
    description: z.string().min(1, "Description is required"),
    comment: z.string().max(500, "Comment must be at most 500 characters"),
    amount: z
        .string()
        .refine((value) => {
            const decimalValue = value.replace(",", ".")
            return isValidDecimalWithPrecision(decimalValue, 12, 2)
        }, "Invalid amount")
        .refine(
            (value) => isGreaterThanOrEqualToZero(value),
            "Amount must be greater than or equal to zero",
        )
        .transform((value) => value.replace(",", ".")),
    currency: z.nativeEnum(Currency, {
        errorMap: () => ({ message: "Invalid currency" }),
    }),
    tax: z.nativeEnum(Tax, {
        errorMap: () => ({ message: "Invalid tax" }),
    }),
    apply_inflation: z.boolean(),
    cost_allocations: z
        .array(saveCostAllocationSchema)
        .min(1, "At least one cost allocation is required")
        .refine((allocations) => {
            const uniqueAllocations = new Set(
                allocations.map((alloc) => `${alloc.year}-${alloc.month}`),
            )
            return uniqueAllocations.size === allocations.length
        }, "Duplicate year/month in cost allocations"),
})

export type SaveCostType = z.infer<typeof saveCostSchema>
export type SaveCostAllocationType = z.infer<typeof saveCostAllocationSchema>
