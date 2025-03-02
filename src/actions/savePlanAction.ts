"use server"

import { actionClient } from "@/lib/safe-action"
import { CreatePlan, UpdatePlan } from "@/models"
import { savePlanSchema, SavePlanType } from "@/zod-schemas/plan"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { errorHandling } from "./validation.error"

export const savePlanAction = actionClient
    .metadata({ actionName: "savePlanAction" })
    .schema(savePlanSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({ parsedInput: plan }: { parsedInput: SavePlanType }) => {
        if (plan.plan_id === "(New)") {
            return await createPlan(plan)
        } else {
            return await updatePlan(plan)
        }
    })

async function createPlan(input: SavePlanType) {
    const plan: CreatePlan = {
        ...input,
        assumptions: input.assumptions.map((assumption) => ({
            year:
                typeof assumption.year === "string"
                    ? parseInt(assumption.year)
                    : assumption.year,
            inflation:
                typeof assumption.inflation === "string"
                    ? parseFloat(assumption.inflation)
                    : assumption.inflation,
            currencies: assumption.currencies.map((currency) => ({
                ...currency,
                exchange: parseFloat(currency.exchange),
            })),
        })),
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/plans`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
    })

    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { plan_id }: { plan_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `plan ID #${plan_id} created successfully`,
        plan_id: plan_id,
    }
}

async function updatePlan(input: SavePlanType) {
    const plan: UpdatePlan = {
        ...input,
        assumptions: input.assumptions.map((assumption) => ({
            year:
                typeof assumption.year === "string"
                    ? parseInt(assumption.year)
                    : assumption.year,
            inflation:
                typeof assumption.inflation === "string"
                    ? parseFloat(assumption.inflation)
                    : assumption.inflation,
            currencies: assumption.currencies.map((currency) => ({
                ...currency,
                exchange: parseFloat(currency.exchange),
            })),
        })),
    }

    const response = await fetch(
        `${process.env.NEXT_API_URL}/plans/${input.plan_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(plan),
        },
    )

    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { plan_id }: { plan_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `plan ID #${plan_id} updated successfully`,
        plan_id: plan_id,
    }
}
