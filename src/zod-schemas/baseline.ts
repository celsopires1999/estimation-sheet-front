import { z } from "zod"

const saveBaselineSchema = z.object({
    baseline_id: z.string().uuid("invalid Baseline Id"),
    code: z.string().min(1, "Code is required"),
    review: z
        .union([z.string(), z.number()])
        .refine(
            (value) => {
                let review: number

                if (typeof value === "string") {
                    review = parseInt(value)

                    if (isNaN(review)) {
                        return false
                    }
                } else {
                    review = value
                }

                if (review < 1 || review > 99) {
                    return false
                }

                return true
            },
            {
                message: "Review must be a number between 1 and 99",
            },
        )
        .transform((value) => {
            if (typeof value === "string") {
                return parseInt(value)
            }
            return value
        }),
    // .min(1, "Review is required")
    // .max(99, "Review must be between 1 and 99"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    start_month: z
        .union([z.string(), z.number()])
        .refine(
            (value) => {
                let month: number

                if (typeof value === "string") {
                    month = parseInt(value)

                    if (isNaN(month)) {
                        return false
                    }
                } else {
                    month = value
                }

                if (month < 1 || month > 12) {
                    return false
                }

                return true
            },
            {
                message: "Invalid month",
            },
        )
        .transform((value) => {
            if (typeof value === "string") {
                return parseInt(value)
            }
            return value
        }),
    start_year: z
        .union([z.string(), z.number()])
        .refine(
            (value) => {
                let year: number

                if (typeof value === "string") {
                    year = parseInt(value)

                    if (isNaN(year)) {
                        return false
                    }
                } else {
                    year = value
                }

                if (year < 2024 || year > 2030) {
                    return false
                }

                return true
            },
            {
                message: "Year must be between 2024 and 2030",
            },
        )
        .transform((value) => {
            if (typeof value === "string") {
                return parseInt(value)
            }
            return value
        }),

    // duration: z.number().min(1, "Duration is required"),
    duration: z
        .union([z.string(), z.number()])
        .refine(
            (value) => {
                let duration: number

                if (typeof value === "string") {
                    duration = parseInt(value)

                    if (isNaN(duration)) {
                        return false
                    }
                } else {
                    duration = value
                }

                if (duration < 1 || duration > 60) {
                    return false
                }

                return true
            },
            {
                message: "Duration must be between 1 and 60 months",
            },
        )
        .transform((value) => {
            if (typeof value === "string") {
                return parseInt(value)
            }
            return value
        }),

    manager_id: z.string().uuid("invalid Manager Id"),
    estimator_id: z.string().uuid("invalid Solution Architect Id"),
})

export default saveBaselineSchema

export type SaveBaselineType = z.infer<typeof saveBaselineSchema>
