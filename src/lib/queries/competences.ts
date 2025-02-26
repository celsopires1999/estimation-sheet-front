import "server-only"

import { Competence, GetCompetencesBody } from "@/models"

export async function getCompetences(): Promise<Competence[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/competences`)
    if (!response.ok) {
        throw new Error("Failed to fetch competences")
    }
    const data: GetCompetencesBody = await response.json()
    return data.competences
}
