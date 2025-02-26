import { isValidNumber } from "@/lib/utils"
import { z } from "zod"

export const saveEffortAllocationSchema = z.object({
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
    hours: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 1, 99_999), {
            message: "Hours range must be between 1 and 99.999",
        }),
})

export const saveEffortSchema = z.object({
    effort_id: z.union([
        z.string().uuid("invalid Effort Id"),
        z.literal("(New)"),
    ]),
    baseline_id: z.string().uuid("invalid Baseline Id"),
    competence_id: z.string().uuid("invalid Competence Id"),
    comment: z.string().max(500, "Comment must be at most 500 characters"),
    hours: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 1, 999_999), {
            message: "Hours range must be between 1 and 999.999",
        }),
    effort_allocations: z
        .array(saveEffortAllocationSchema)
        .min(1, "At least one effort allocation is required")
        .refine((allocations) => {
            const uniqueAllocations = new Set(
                allocations.map((alloc) => `${alloc.year}-${alloc.month}`),
            )
            return uniqueAllocations.size === allocations.length
        }, "Duplicate year/month in effort allocations"),
})

export type SaveEffortType = z.infer<typeof saveEffortSchema>
export type SaveEffortAllocationType = z.infer<
    typeof saveEffortAllocationSchema
>
