"use server"

import { actionClient } from "@/lib/safe-action"
import { flattenValidationErrors } from "next-safe-action"
import { revalidatePath } from "next/cache"
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
            // const uc = new DeleteBaselineUseCase()
            // const result = await uc.execute({
            //     BaselineId: params.BaselineId,
            // })

            const result = {
                BaselineId: params.baselineId,
            }

            revalidatePath(`/Baselines/`)

            return {
                message: `Baseline ID #${result.BaselineId} deleted successfully.`,
            }
        },
    )
