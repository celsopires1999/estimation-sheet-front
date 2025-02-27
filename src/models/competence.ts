export type Competence = {
    competence_id: string
    code: string
    name: string
    created_at: Date
    updated_at: Date | null
}

export type GetCompetencesBody = {
    competences: Competence[]
}

export type CompetenceOption = {
    id: string
    description: string
}

export type CreateCompetence = Omit<
    Competence,
    "competence_id" | "created_at" | "updated_at"
>
export type UpdateCompetence = Partial<
    Omit<Competence, "competence_id" | "created_at" | "updated_at">
>
