import "server-only"

import { Competence, GetCompetencesBody } from "@/models"

export async function getCompetenceSearchResults(
    searchText: string,
): Promise<Competence[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/competences`)

    if (!response.ok) {
        throw new Error("Failed to fetch competences")
    }

    const data: GetCompetencesBody = await response.json()

    if (searchText === "/") {
        return data.competences
    }

    return data.competences.filter((competence) => {
        return (
            competence.code.toLowerCase().includes(searchText.toLowerCase()) ||
            competence.name.toLowerCase().includes(searchText.toLowerCase())
        )
    })
}

export async function getCompetence(competenceID: string): Promise<Competence> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/competences/${competenceID}`,
    )
    if (!response.ok) {
        throw new Error("Failed to fetch competence")
    }
    const data: Competence = await response.json()
    return data
}

export async function getCompetences(): Promise<Competence[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/competences`)
    if (!response.ok) {
        throw new Error("Failed to fetch competences")
    }
    const data: GetCompetencesBody = await response.json()
    return data.competences
}
