"use server"

import { getMonthDescription } from "@/data"
import { getBaseline } from "@/lib/queries/baselines"
import { actionClient } from "@/lib/safe-action"
import { CostType, CreateCost, UpdateCost } from "@/models"
import { saveCostSchema, SaveCostType } from "@/zod-schemas/cost"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { errorHandling, ValidationError } from "./validation.error"

export const saveCostAction = actionClient
    .metadata({ actionName: "saveCostAction" })
    .schema(saveCostSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({ parsedInput: cost }: { parsedInput: SaveCostType }) => {
        if (cost.cost_id === "(New)") {
            return await createCost(cost)
        } else {
            return await updateCost(cost)
        }
    })

async function createCost(input: SaveCostType) {
    const cost: CreateCost = {
        baseline_id: input.baseline_id,
        cost_type: input.cost_type,
        description: input.description,
        comment: input.comment,
        amount: parseFloat(input.amount),
        currency: input.currency,
        tax: parseFloat(input.tax),
        apply_inflation: input.apply_inflation,
        cost_allocations: input.cost_allocations.map((alloc) => ({
            year:
                typeof alloc.year === "string"
                    ? parseInt(alloc.year)
                    : alloc.year,
            month:
                typeof alloc.month === "string"
                    ? parseInt(alloc.month)
                    : alloc.month,
            amount:
                typeof alloc.amount === "string"
                    ? parseFloat(alloc.amount)
                    : alloc.amount,
        })),
    }

    await validateAllocations(input)

    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${input.baseline_id}/costs`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cost),
        },
    )

    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { cost_id }: { cost_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Cost ID #${cost_id} created successfully`,
        cost_id: cost_id,
    }
}

async function updateCost(input: SaveCostType) {
    const cost: UpdateCost = {
        cost_type: input.cost_type,
        description: input.description,
        comment: input.comment,
        amount: parseFloat(input.amount),
        currency: input.currency,
        tax: parseFloat(input.tax),
        apply_inflation: input.apply_inflation,
        cost_allocations: input.cost_allocations.map((alloc) => ({
            year:
                typeof alloc.year === "string"
                    ? parseInt(alloc.year)
                    : alloc.year,
            month:
                typeof alloc.month === "string"
                    ? parseInt(alloc.month)
                    : alloc.month,
            amount:
                typeof alloc.amount === "string"
                    ? parseFloat(alloc.amount)
                    : alloc.amount,
        })),
    }

    await validateAllocations(input)

    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${input.baseline_id}/costs/${input.cost_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cost),
        },
    )

    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { cost_id }: { cost_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Cost ID #${cost_id} updated successfully`,
        cost_id: cost_id,
    }
}

async function validateAllocations(input: SaveCostType) {
    const baseline = await getBaseline(input.baseline_id)

    if (!baseline) {
        throw new ValidationError(`Baseline ${input.baseline_id} not found`)
    }

    const startDate = new Date(baseline.start_date)
    const endDate = new Date(startDate)

    endDate.setMonth(endDate.getMonth() + baseline.duration)

    for (const allocation of input.cost_allocations) {
        const year = +allocation.year
        const month = +allocation.month

        const allocDate = new Date(year, month - 1, 1)

        switch (input.cost_type) {
            case CostType.RC:
                if (allocDate < startDate) {
                    throw new ValidationError(
                        `Allocation month (${allocDate.getFullYear()} ${getMonthDescription(month.toString())}) must be greater than start baseline month`,
                    )
                }
                break
            default:
                if (allocDate < startDate || allocDate > endDate) {
                    throw new ValidationError(
                        `Allocation month (${allocDate.getFullYear()} ${getMonthDescription(month.toString())}) must be between start and end baseline months (duration)`,
                    )
                }
        }
    }
}
