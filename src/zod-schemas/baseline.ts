import { isValidNumber } from "@/lib/utils"
import { z } from "zod"

export const saveBaselineSchema = z.object({
    baseline_id: z.union([
        z.string().uuid("invalid Baseline Id"),
        z.literal("(New)"),
    ]),
    code: z.string().min(1, "Code is required"),
    review: z.coerce
        .number()
        .min(1, "Review is required")
        .max(99, "Review must be a number between 1 and 99"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    start_year: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 2023, 2030), {
            message: "Invalid year",
        }),
    start_month: z
        .union([z.number(), z.string()])
        .refine((value) => isValidNumber(value, 1, 12), {
            message: "Invalid month",
        }),
    duration: z.coerce
        .number()
        .min(1, "Duration is required")
        .max(60, "Duration must be between 1 and 60 months"),
    manager_id: z.string().uuid("invalid Manager Id"),
    estimator_id: z.string().uuid("invalid Solution Architect Id"),
})

export type SaveBaselineType = z.infer<typeof saveBaselineSchema>
