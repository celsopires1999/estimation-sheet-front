"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { ValidationError, ValidationErrorCodes } from "./validation.error"

const deleteEffortSchema = z.object({
    effortId: z.string().uuid("invalid effort ID"),
    baselineId: z.string().uuid("invalid baseline ID"),
})

export type deleteEffortSchemaType = typeof deleteEffortSchema._type

export const deleteEffortAction = actionClient
    .metadata({ actionName: "deleteEffortAction" })
    .schema(deleteEffortSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deleteEffortSchemaType
        }) => {
            const { effortId, baselineId } = params

            const response = await fetch(
                `${process.env.NEXT_API_URL}/baselines/${baselineId}/efforts/${effortId}`,
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
                message: `Effort ID #${effortId} deleted successfully.`,
            }
        },
    )
