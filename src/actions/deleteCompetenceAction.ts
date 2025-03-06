"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { errorHandling } from "./validation.error"

const deleteCompetenceSchema = z.object({
    competenceId: z.string().uuid("invalid UUID"),
})

export type deleteCompetenceSchemaType = typeof deleteCompetenceSchema._type

export const deleteCompetenceAction = actionClient
    .metadata({ actionName: "deleteCompetenceAction" })
    .schema(deleteCompetenceSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deleteCompetenceSchemaType
        }) => {
            const competenceId = params.competenceId
            const response = await fetch(
                `${process.env.NEXT_API_URL}/competences/${competenceId}`,
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
                message: `Competence ID #${competenceId} deleted successfully.`,
            }
        },
    )
