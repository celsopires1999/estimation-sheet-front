export type Effort = {
    effort_id: string
    baseline_id: string
    competence_id: string
    competence_code: string
    competence_name: string
    comment: string
    hours: number
    effort_allocations: EffortAllocation[]
    created_at: Date
    updated_at: Date | null
}

export type EffortAllocation = {
    year: number
    month: number
    hours: number
}

export type GetEffort = Effort

export type CreateEffort = Omit<
    Effort,
    | "effort_id"
    | "competence_code"
    | "competence_name"
    | "created_at"
    | "updated_at"
>

export type UpdateEffort = Omit<
    Effort,
    | "effort_id"
    | "competence_code"
    | "competence_name"
    | "created_at"
    | "updated_at"
>

export type GetEffortsBody = {
    efforts: Effort[]
}
