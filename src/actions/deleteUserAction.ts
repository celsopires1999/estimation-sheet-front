"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { z } from "zod"
import { errorHandling } from "./validation.error"

const deleteUserSchema = z.object({
    userId: z.string().uuid("invalid UUID"),
})

export type deleteUserSchemaType = typeof deleteUserSchema._type

export const deleteUserAction = actionClient
    .metadata({ actionName: "deleteUserAction" })
    .schema(deleteUserSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: params,
        }: {
            parsedInput: deleteUserSchemaType
        }) => {
            const userId = params.userId
            const response = await fetch(
                `${process.env.NEXT_API_URL}/users/${userId}`,
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
                message: `User ID #${userId} deleted successfully.`,
            }
        },
    )
