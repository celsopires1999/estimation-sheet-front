"use server"

import { getMonthDescription } from "@/data"
import { getBaseline } from "@/lib/queries/baselines"
import { actionClient } from "@/lib/safe-action"
import { CreateEffort, UpdateEffort } from "@/models"
import { saveEffortSchema, SaveEffortType } from "@/zod-schemas/effort"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { ValidationError, ValidationErrorCodes } from "./validation.error"

export const saveEffortAction = actionClient
    .metadata({ actionName: "saveEffortAction" })
    .schema(saveEffortSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({ parsedInput: effort }: { parsedInput: SaveEffortType }) => {
            if (effort.effort_id === "(New)") {
                return await createEffort(effort)
            } else {
                return await updateEffort(effort)
            }
        },
    )

async function createEffort(input: SaveEffortType) {
    const effort: CreateEffort = {
        baseline_id: input.baseline_id,
        competence_id: input.competence_id,
        comment: input.comment,
        hours: +input.hours,
        effort_allocations: input.effort_allocations.map((alloc) => ({
            year:
                typeof alloc.year === "string"
                    ? parseInt(alloc.year)
                    : alloc.year,
            month:
                typeof alloc.month === "string"
                    ? parseInt(alloc.month)
                    : alloc.month,
            hours:
                typeof alloc.hours === "string"
                    ? parseInt(alloc.hours)
                    : alloc.hours,
        })),
    }

    await validateAllocations(input)

    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${input.baseline_id}/efforts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(effort),
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

    const { effort_id }: { effort_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Effort ID #${effort_id} created successfully`,
        effort_id: effort_id,
    }
}

async function updateEffort(input: SaveEffortType) {
    const effort: UpdateEffort = {
        baseline_id: input.baseline_id,
        competence_id: input.competence_id,
        comment: input.comment,
        hours: +input.hours,
        effort_allocations: input.effort_allocations.map((alloc) => ({
            year:
                typeof alloc.year === "string"
                    ? parseInt(alloc.year)
                    : alloc.year,
            month:
                typeof alloc.month === "string"
                    ? parseInt(alloc.month)
                    : alloc.month,
            hours:
                typeof alloc.hours === "string"
                    ? parseInt(alloc.hours)
                    : alloc.hours,
        })),
    }

    await validateAllocations(input)

    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${input.baseline_id}/efforts/${input.effort_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(effort),
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

    const { effort_id }: { effort_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Effort ID #${effort_id} updated successfully`,
        effort_id: effort_id,
    }
}

async function validateAllocations(input: SaveEffortType) {
    const baseline = await getBaseline(input.baseline_id)

    if (!baseline) {
        throw new ValidationError(`Baseline ${input.baseline_id} not found`)
    }

    const startDate = new Date(baseline.start_date)
    const endDate = new Date(startDate)

    endDate.setMonth(endDate.getMonth() + baseline.duration)

    for (const allocation of input.effort_allocations) {
        const year = +allocation.year
        const month = +allocation.month

        const allocDate = new Date(year, month - 1, 1)

        if (allocDate < startDate || allocDate > endDate) {
            throw new ValidationError(
                `Allocation month (${allocDate.getFullYear()} ${getMonthDescription(month.toString())}) must be between start and end baseline months (duration)`,
            )
        }
    }
}
