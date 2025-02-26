type Cost = {
    cost_id: string
    baseline_id: string
    cost_type: string
    description: string
    comment: string
    amount: number
    currency: string
    tax: number
    apply_inflation: boolean
    cost_allocations: CostAllocation[]
    created_at: Date
    updated_at: Date | null
}

type CostAllocation = {
    year: number
    month: number
    amount: number
}

export type GetCost = Cost

export type CreateCost = Omit<Cost, "cost_id" | "created_at" | "updated_at">

export type UpdateCost = Partial<
    Omit<Cost, "cost_id" | "created_at" | "updated_at">
>

export type GetCostsBody = {
    costs: Cost[]
}

export const CostType = {
    OTC: "one_time",
    RC: "running",
    INV: "investment",
} as const

export type CostType = (typeof CostType)[keyof typeof CostType]

export const CostTypeOptions = Object.entries(CostType).map(([key, value]) => ({
    id: value,
    description: key,
}))

export function getCostTypeDescription(costType: string | unknown) {
    let costTypeStr = ""

    if (typeof costType !== "string") {
        costTypeStr = String(costType)
    } else {
        costTypeStr = costType
    }

    const foundCostType = CostTypeOptions.find(
        (c) => c.id === costTypeStr,
    )?.description
    return foundCostType ?? ""
}

export const Currency = {
    BRL: "BRL",
    USD: "USD",
    EUR: "EUR",
} as const

export type Currency = (typeof Currency)[keyof typeof Currency]

export const CurrencyOptions = Object.entries(Currency).map(([key, value]) => ({
    id: value,
    description: key,
}))

export const Tax = {
    "Not Applicable (0%)": "0",
    "Intercompany (23%)": "23",
    "International (45%)": "45",
} as const

export type Tax = (typeof Tax)[keyof typeof Tax]

export const TaxOptions = Object.entries(Tax).map(([key, value]) => ({
    id: value,
    description: key,
}))

export function getTaxDescription(tax: string | unknown) {
    let taxStr = ""
    if (typeof tax !== "string") {
        taxStr = String(tax)
    } else {
        taxStr = tax
    }
    const foundTax = TaxOptions.find((t) => t.id === taxStr)?.description
    return foundTax ?? ""
}
