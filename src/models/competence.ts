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
