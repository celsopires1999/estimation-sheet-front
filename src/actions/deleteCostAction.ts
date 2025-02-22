"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { ValidationError, ValidationErrorCodes } from "./validation.error"

const deleteCostSchema = z.object({
    costId: z.string().uuid("invalid cost ID"),
    baselineId: z.string().uuid("invalid baseline ID"),
})

export type deleteCostSchemaType = typeof deleteCostSchema._type

export const deleteCostAction = actionClient
    .metadata({ actionName: "deleteCostAction" })
    .schema(deleteCostSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deleteCostSchemaType
        }) => {
            const { costId, baselineId } = params

            const response = await fetch(
                `${process.env.NEXT_API_URL}/baselines/${baselineId}/costs/${costId}`,
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
                message: `Cost ID #${costId} deleted successfully.`,
            }
        },
    )
