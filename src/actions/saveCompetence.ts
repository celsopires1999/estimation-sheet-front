"use server"

import { actionClient } from "@/lib/safe-action"
import { CreateCompetence, UpdateCompetence } from "@/models"
import {
    saveCompetenceSchema,
    SaveCompetenceType,
} from "@/zod-schemas/competence"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { errorHandling } from "./validation.error"

export const saveCompetenceAction = actionClient
    .metadata({ actionName: "saveCompetenceAction" })
    .schema(saveCompetenceSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({
            parsedInput: competence,
        }: {
            parsedInput: SaveCompetenceType
        }) => {
            if (competence.competence_id === "(New)") {
                return await createCompetence(competence)
            } else {
                return await updateCompetence(competence)
            }
        },
    )

async function createCompetence(input: SaveCompetenceType) {
    const competence: CreateCompetence = {
        code: input.code,
        name: input.name,
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/competences`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(competence),
    })

    if (!response.ok) {
        await errorHandling(response)
    }
    const data = await response.json()

    const { competence_id }: { competence_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Competence ID #${competence_id} created successfully`,
        competence_id: competence_id,
    }
}

async function updateCompetence(input: SaveCompetenceType) {
    const competence: UpdateCompetence = {
        code: input.code,
        name: input.name,
    }

    const response = await fetch(
        `${process.env.NEXT_API_URL}/competences/${input.competence_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(competence),
        },
    )
    if (!response.ok) {
        await errorHandling(response)
    }
    const data = await response.json()

    const { competence_id }: { competence_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `Competence ID #${competence_id} updated successfully`,
        competence_id: competence_id,
    }
}
