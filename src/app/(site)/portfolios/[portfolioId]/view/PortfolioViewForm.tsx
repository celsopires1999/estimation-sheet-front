import { BaselineNav } from "@/components/BaselineNav"
import { PlanBadge } from "@/components/PlanBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMonthDescription } from "@/data"
import { BudgetTypeYearly, GetPortfolioWithItems } from "@/models"
import { BudgetTable } from "./BudgetTable"
import { BudgetYearlyTable } from "./BudgetYearlyTable"
import { WorkloadTable } from "./WorkloadTable"
import { WorkloadYearlyTable } from "./WorkloadYearlyTable"

type Props = {
    portfolio: GetPortfolioWithItems
}

export function PortfolioViewForm({ portfolio }: Props) {
    const budgetYearly = calculateBudgetYearly(portfolio.budgets)
    const totalBudget = calculateTotalBudget(portfolio.budgets)
    const workloadYearly = calculateWorkloadYearly(portfolio.workloads)
    const month = getMonthDescription(portfolio.start_date.substring(5, 7))
    const year = portfolio.start_date.substring(0, 4)

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Portfolio View</h2>
                <BaselineNav baselineId={portfolio.baseline_id} />
            </div>
            <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3>{portfolio.plan_code}</h3>
                        <PlanBadge value={portfolio.plan_type} />
                    </div>
                    <h3>{`${portfolio.estimator} & ${portfolio.manager}`}</h3>
                </div>
                <div className="flex items-center justify-between">
                    <h3>
                        {`${portfolio.code} / ${portfolio.review}: `}
                        <span className="truncate">{`${portfolio.title}`}</span>
                    </h3>
                    <div className="flex items-center gap-4">
                        <h3>
                            {`Starting on ${year} ${month}: ${portfolio.duration} months (duration)`}
                        </h3>
                    </div>
                </div>
                {/* <hr className="w-full" /> */}
            </div>

            <Tabs defaultValue="budget">
                <TabsList className="grid w-[205px] grid-cols-2">
                    {/* <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1"> */}
                    <TabsTrigger value="budget">Budget</TabsTrigger>
                    <TabsTrigger value="workload">Workload</TabsTrigger>
                </TabsList>
                <TabsContent value="budget">
                    <Card>
                        <CardContent>
                            <div className="mt-4 flex flex-col md:flex-row">
                                <div className="w-4/6">
                                    {/* <CardHeader>Budget Items</CardHeader> */}
                                    <BudgetTable
                                        data={portfolio.budgets ?? []}
                                    />
                                </div>
                                <div className="w-2/3 md:w-2/6">
                                    {/* <CardHeader>Budget Yearly</CardHeader> */}
                                    <BudgetYearlyTable
                                        data={budgetYearly}
                                        total={totalBudget}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="workload">
                    <Card>
                        <CardContent>
                            <div className="mt-4 flex flex-col md:flex-row">
                                <div className="w-4/6">
                                    {/* <CardHeader>Workload Items</CardHeader> */}
                                    <WorkloadTable
                                        data={portfolio.workloads ?? []}
                                    />
                                </div>
                                <div className="mt-4 w-2/3 md:w-2/6">
                                    {/* <CardHeader>Workload Yearly</CardHeader> */}
                                    <WorkloadYearlyTable
                                        data={workloadYearly}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}

function calculateWorkloadYearly(
    workloads: GetPortfolioWithItems["workloads"],
) {
    const result: {
        year: number
        competence_code: string
        hours: number
    }[] = []

    if (!workloads) {
        return result
    }

    workloads.forEach((workload) => {
        workload.workload_yearly.forEach((yearly) => {
            result.push({
                year: yearly.year,
                competence_code: workload.competence_code,
                hours: yearly.hours,
            })
        })
    })

    result.sort((a, b) => {
        if (a.year === b.year) {
            return a.competence_code.localeCompare(b.competence_code)
        }
        return a.year - b.year
    })

    return result
}

function calculateTotalBudget(budgets: GetPortfolioWithItems["budgets"]): {
    opex: number
    capex: number
    run: number
} {
    if (!budgets) {
        return { opex: 0, capex: 0, run: 0 }
    }

    const opex = budgets
        .filter((budget) => budget.cost_type === "one_time")
        .reduce((total, budget) => total + budget.amount, 0)
    const capex = budgets
        .filter((budget) => budget.cost_type === "investment")
        .reduce((total, budget) => total + budget.amount, 0)
    const run = budgets
        .filter((budget) => budget.cost_type === "running")
        .reduce((total, budget) => total + budget.amount, 0)

    return { opex, capex, run }
}

function calculateBudgetYearly(
    budgets: GetPortfolioWithItems["budgets"],
): BudgetTypeYearly[] {
    if (!budgets) {
        return []
    }

    const yearCostTypeMap: Map<string, number> = new Map<string, number>()

    budgets.forEach((budget) => {
        budget.budget_yearly.forEach((y) => {
            let value = yearCostTypeMap.get(
                y.year.toString() + "\n" + budget.cost_type,
            )

            if (value) {
                value += y.amount
                yearCostTypeMap.set(
                    y.year.toString() + "\n" + budget.cost_type,
                    value,
                )
            } else {
                yearCostTypeMap.set(
                    y.year.toString() + "\n" + budget.cost_type,
                    y.amount,
                )
            }
        })
    })

    const result = Array.from(yearCostTypeMap).map(([key, value]) => {
        const year = key.split("\n")[0]
        const cost_type = key.split("\n")[1]
        return {
            year: +year,
            cost_type,
            amount: value,
        }
    })

    return result.sort((a, b) => {
        if (a.year === b.year) {
            return a.cost_type.localeCompare(b.cost_type)
        }
        return a.year - b.year
    })
}
