export type Plan = {
    plan_id: string
    plan_type: string
    code: string
    name: string
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

export type PreliminaryPlanOption = {
    id: string
    description: string
}

export type DefinitivePlanOption = {
    id: string
    description: string
}

export const PlanType = {
    Preliminary: "preliminary",
    Definitive: "definitive",
} as const

export type PlanType = (typeof PlanType)[keyof typeof PlanType]

export const PlanTypeOptions = Object.entries(PlanType).map(([key, value]) => ({
    id: value,
    description: key,
}))

export function getPlanTypeDescription(planType: string | unknown) {
    let planTypeStr = ""

    if (typeof planType !== "string") {
        planTypeStr = String(planType)
    } else {
        planTypeStr = planType
    }

    const foundPlanType = PlanTypeOptions.find(
        (c) => c.id === planTypeStr,
    )?.description
    return foundPlanType ?? ""
}
