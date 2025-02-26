type Baseline = {
    baseline_id: string
    code: string
    review: number
    title: string
    description: string
    duration: number
    manager_id: string
    estimator_id: string
    start_year: number
    start_month: number
    created_at: Date
    updated_at: Date | null
}

export type GetBaselinesBody = {
    baselines: GetBaseline[]
}

export type GetBaseline = Omit<Baseline, "start_year" | "start_month"> & {
    manager: string
    estimator: string
    start_date: string
}

export type CreateBaseline = Omit<
    Baseline,
    "baseline_id" | "created_at" | "updated_at"
>
export type UpdateBaseline = Partial<
    Omit<Baseline, "baseline_id" | "created_at" | "updated_at">
>
