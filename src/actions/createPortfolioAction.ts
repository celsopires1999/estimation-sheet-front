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
    const user: CreatePortfolioCommand = {
        ...input,
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/portfolios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        const e = await response.json()

        if (ValidationErrorCodes.includes(response.status)) {
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
