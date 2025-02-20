"use server"

import { actionClient } from "@/lib/safe-action"
import saveBaselineSchema, { SaveBaselineType } from "@/zod-schemas/baseline"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"

export const saveBaselineAction = actionClient
    .metadata({ actionName: "saveBaselineAction" })
    .schema(saveBaselineSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: baseline,
        }: {
            parsedInput: SaveBaselineType
        }) => {
            const result = {
                baseline_id: "1234",
            }

            console.log(baseline)

            // force client to refresh the page
            const c = await cookies()
            c.set("force-refresh", JSON.stringify(Math.random()))

            return {
                message: `Baseline ID #${result.baseline_id} created successfully`,
                baseline_id: result.baseline_id,
            }
        },
    )
