"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"

const deleteBaselineSchema = z.object({
    baselineId: z.string().uuid("invalid UUID"),
})

export type deleteBaselineSchemaType = typeof deleteBaselineSchema._type

export const deleteBaselineAction = actionClient
    .metadata({ actionName: "deleteBaselineAction" })
    .schema(deleteBaselineSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deleteBaselineSchemaType
        }) => {
            const baselineId = params.baselineId
            console.log(baselineId)

            const response = await fetch(
                `${process.env.NEXT_API_URL}/baselines/${baselineId}`,
                {
                    method: "DELETE",
                },
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }

            // force client to refresh the page
            const c = await cookies()
            c.set("force-refresh", JSON.stringify(Math.random()))

            return {
                message: `Baseline ID #${baselineId} deleted successfully.`,
            }
        },
    )
