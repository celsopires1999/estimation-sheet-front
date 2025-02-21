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
            console.log(baseline)

            if (baseline.baseline_id === "(New)") {
                return await createBaseline(baseline)
            } else {
                return await updateBaseline(baseline)
            }
        },
    )

async function createBaseline(baseline: SaveBaselineType) {
    const response = await fetch(`${process.env.NEXT_API_URL}/baselines`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(baseline),
    })

    const data = await response.json()

    if (!response.ok) {
        const error = data
        throw new Error(error.message)
    }

    const { baseline_id }: { baseline_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Baseline ID #${baseline_id} created successfully`,
        baseline_id: baseline_id,
    }
}

async function updateBaseline(baseline: SaveBaselineType) {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baseline.baseline_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(baseline),
        },
    )

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }
    const data = await response.json()

    const { baseline_id }: { baseline_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Baseline ID #${baseline_id} updated successfully`,
        baseline_id: baseline_id,
    }
}
