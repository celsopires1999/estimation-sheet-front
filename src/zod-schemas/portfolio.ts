import { z } from "zod"

export const createPortfolioSchema = z.object({
    baseline_id: z.string().uuid("invalid Baseline Id"),
    plan_id: z.string().uuid("invalid Plan Id"),
    shift_months: z.coerce
        .number()
        .min(1, "Shift months is required")
        .max(99, "Shift months must be a number between 1 and 99"),
})

export type CreatePortfolioType = z.infer<typeof createPortfolioSchema>
