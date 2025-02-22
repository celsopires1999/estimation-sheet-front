"use server"

import { actionClient } from "@/lib/safe-action"
import { CreateBaseline, UpdateBaseline } from "@/models"
import { saveBaselineSchema, SaveBaselineType } from "@/zod-schemas/baseline"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { ValidationError, ValidationErrorCodes } from "./validation.error"

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
            if (baseline.baseline_id === "(New)") {
                return await createBaseline(baseline)
            } else {
                return await updateBaseline(baseline)
            }
        },
    )

async function createBaseline(input: SaveBaselineType) {
    const baseline: CreateBaseline = {
        code: input.code,
        review: input.review,
        title: input.title,
        description: input.description,
        duration: input.duration,
        manager_id: input.manager_id,
        estimator_id: input.estimator_id,
        start_year: +input.start_year,
        start_month: +input.start_month,
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/baselines`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(baseline),
    })

    if (!response.ok) {
        const e = await response.json()

        if (ValidationErrorCodes.includes(response.status)) {
            throw new ValidationError(e.message)
        }

        console.error(e)
        throw new Error(e.error)
    }

    const data = await response.json()

    const { baseline_id }: { baseline_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Baseline ID #${baseline_id} created successfully`,
        baseline_id: baseline_id,
    }
}

async function updateBaseline(input: SaveBaselineType) {
    const baseline: UpdateBaseline = {
        code: input.code,
        review: input.review,
        title: input.title,
        description: input.description,
        duration: input.duration,
        manager_id: input.manager_id,
        estimator_id: input.estimator_id,
        start_year: +input.start_year,
        start_month: +input.start_month,
    }

    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${input.baseline_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(baseline),
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
