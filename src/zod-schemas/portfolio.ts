import { isValidNumber } from "@/lib/utils"
import { z } from "zod"

export const createPortfolioSchema = z.object({
    baseline_id: z.string().uuid("invalid Baseline Id"),
    plan_id: z.string().uuid("invalid Plan Id"),

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

    // shift_months: z.coerce
    //     .number()
    //     .min(1, "Shift months is required")
    //     .max(99, "Shift months must be a number between 1 and 99"),
})

export type CreatePortfolioType = z.infer<typeof createPortfolioSchema>
