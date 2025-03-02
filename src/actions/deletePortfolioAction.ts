"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { ValidationError, ValidationErrorCodes } from "./validation.error"

const deletePortfolioSchema = z.object({
    portfolioId: z.string().uuid("invalid UUID"),
})

export type deletePortfolioSchemaType = typeof deletePortfolioSchema._type

export const deletePortfolioAction = actionClient
    .metadata({ actionName: "deletePortfolioAction" })
    .schema(deletePortfolioSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deletePortfolioSchemaType
        }) => {
            const portfolioId = params.portfolioId
            const response = await fetch(
                `${process.env.NEXT_API_URL}/portfolios/${portfolioId}`,
                {
                    method: "DELETE",
                },
            )

            if (!response.ok) {
                const e = await response.json()

                if (ValidationErrorCodes.includes(response.status)) {
                    throw new ValidationError(e.message)
                }

                console.error(e)
                throw new Error(e.error)
            }

            // force client to refresh the page
            const c = await cookies()
            c.set("force-refresh", JSON.stringify(Math.random()))

            return {
                message: `Portfolio ID #${portfolioId} deleted successfully.`,
            }
        },
    )
