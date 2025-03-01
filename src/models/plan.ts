export type Plan = {
    plan_id: string
    code: string
    name: string
    is_preview: boolean
    assumptions: Assumption[]
    created_at: Date
    updated_at: Date | null
}

export type Assumption = {
    year: number
    inflation: number
    currencies: CurrencyAssumption[]
}

export type CurrencyAssumption = {
    currency: string
    exchange: number
}

export type CreatePlan = Omit<Plan, "plan_id" | "created_at" | "updated_at">

export type UpdatePlan = Partial<
    Omit<Plan, "plan_id" | "created_at" | "updated_at">
>

export type GetPlansBody = {
    plans: Plan[]
}
