"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { errorHandling } from "./validation.error"

const deleteCompetenceSchema = z.object({
    planId: z.string().uuid("invalid UUID"),
})

export type deletePlanSchemaType = typeof deleteCompetenceSchema._type

export const deletePlanAction = actionClient
    .metadata({ actionName: "deletePlanAction" })
    .schema(deleteCompetenceSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deletePlanSchemaType
        }) => {
            const planId = params.planId
            const response = await fetch(
                `${process.env.NEXT_API_URL}/plans/${planId}`,
                {
                    method: "DELETE",
                },
            )

            if (!response.ok) {
                await errorHandling(response)
            }

            // force client to refresh the page
            const c = await cookies()
            c.set("force-refresh", JSON.stringify(Math.random()))

            return {
                message: `Competence ID #${planId} deleted successfully.`,
            }
        },
    )
