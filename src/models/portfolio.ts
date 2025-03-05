export type CreatePortfolioCommand = {
    baseline_id: string
    plan_id: string
    shift_months: number
}

export type PortfolioResponse = {
    portfolio_id: string
}

export type PortfoliosBody = {
    portfolios: Portfolio[]
}

export type Portfolio = {
    portfolio_id: string
    baseline_id: string
    code: string
    review: number
    plan_type: string
    plan_code: string
    title: string
    description: string
    duration: number
    manager: string
    estimator: string
    start_date: string
    created_at: Date
    updated_at: Date | null
}

export type GetPortfolioWithItems = Portfolio & {
    budgets: Budget[]
    workloads: Workload[]
}

export type Budget = {
    budget_id: string
    portfolio_id: string
    cost_type: string
    description: string
    comment: string
    cost_amount: number
    cost_currency: string
    cost_tax: number
    cost_apply_inflation: boolean
    amount: number
    budget_allocations: BudgetAllocation[]
    budget_yearly: BudgetYearly[]
    created_at: Date
    updated_at: Date | null
}

export type BudgetAllocation = {
    year: number
    month: number
    amount: number
}

export type BudgetYearly = {
    year: number
    amount: number
}

export type BudgetTypeYearly = {
    year: number
    cost_type: string
    amount: number
}

export type Workload = {
    workload_id: string
    portfolio_id: string
    competence_code: string
    competence_name: string
    comment: string
    hours: number
    workload_allocations: WorkloadAllocation[]
    workload_yearly: WorkloadYearly[]
    created_at: Date
    updated_at: Date | null
}

export type WorkloadAllocation = {
    year: number
    month: number
    hours: number
}

export type WorkloadYearly = {
    year: number
    hours: number
}
