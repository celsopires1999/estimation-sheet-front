"use server"

import { actionClient } from "@/lib/safe-action"
import { CreatePortfolioCommand } from "@/models/portfolio"
import {
    createPortfolioSchema,
    CreatePortfolioType,
} from "@/zod-schemas/portfolio"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { ValidationError, ValidationErrorCodes } from "./validation.error"
import { getBaseline } from "@/lib/queries/baselines"

export const createPortfolioAction = actionClient
    .metadata({ actionName: "createPortfolioAction" })
    .schema(createPortfolioSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: portfolio,
        }: {
            parsedInput: CreatePortfolioType
        }) => {
            return await createPortfolio(portfolio)
        },
    )

async function createPortfolio(input: CreatePortfolioType) {
    const baseline = await getBaseline(input.baseline_id)

    const baselineStartYear = +baseline.start_date.substring(0, 4)
    const baselineStartMonth = +baseline.start_date.substring(5, 7)
    const portfolioStartYear = +input.start_year
    const portfolioStartMonth = +input.start_month

    const diffInMonths =
        (portfolioStartYear - baselineStartYear) * 12 +
        (portfolioStartMonth - baselineStartMonth)

    if (diffInMonths < 0) {
        throw new ValidationError(
            "Portfolio start date must be greater than baseline start date",
        )
    }

    const params: CreatePortfolioCommand = {
        baseline_id: input.baseline_id,
        plan_id: input.plan_id,
        shift_months: diffInMonths,
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/portfolios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })

    if (!response.ok) {
        const e = await response.json()

        if (ValidationErrorCodes.includes(response.status)) {
            if (e.message === "currency and year combination not found") {
                throw new ValidationError(
                    "Baseline duration, shift months and Plan assumptions must match",
                )
            }
            throw new ValidationError(e.message)
        }

        console.error(e)
        throw new Error(e.error)
    }

    const data = await response.json()

    const { portfolio_id }: { portfolio_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Portfolio ID #${portfolio_id} created successfully`,
        portfolio_id: portfolio_id,
    }
}
