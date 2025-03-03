import { PlanBadge } from "@/app/(site)/plans/components/PlanBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMonthDescription } from "@/data"
import { BudgetYearly, GetPortfolioWithItems } from "@/models"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
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
                <div className="flex">
                    <Button variant="ghost" asChild>
                        <Link
                            href={`/baselines/form?baselineId=${portfolio.baseline_id}`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Baseline</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link
                            href={`/baselines/${portfolio.baseline_id}/costs`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Costs</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link
                            href={`/baselines/${portfolio.baseline_id}/efforts`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Efforts</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3>{portfolio.plan_code}</h3>
                        <PlanBadge planType={portfolio.plan_type} />
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
                            <div className="flex flex-col md:flex-row">
                                <div className="w-4/6">
                                    <CardHeader>Budget Items</CardHeader>
                                    <BudgetTable data={portfolio.budgets} />
                                </div>
                                <div className="w-2/3 md:w-2/6">
                                    <CardHeader>Budget Yearly</CardHeader>
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
                            <div className="flex flex-col md:flex-row">
                                <div className="w-4/6">
                                    <CardHeader>Workload Items</CardHeader>
                                    <WorkloadTable data={portfolio.workloads} />
                                </div>
                                <div className="w-2/3 md:w-2/6">
                                    <CardHeader>Workload Yearly</CardHeader>
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

function calculateBudgetYearly(budgets: GetPortfolioWithItems["budgets"]) {
    if (!budgets) {
        return []
    }

    const flatBudgets = budgets.flatMap((budget) => budget.budget_yearly)

    const mapBudgets = flatBudgets.reduce(
        (result, item) => {
            const year = item.year
            if (!result[year]) {
                result[year] = []
            }
            result[year].push(item)
            return result
        },
        {} as { [year: number]: BudgetYearly[] },
    )

    return Object.entries(mapBudgets).map(([year, items]) => ({
        year: Number(year),
        amount: items.reduce((total, item) => total + item.amount, 0),
    }))
}

function calculateTotalBudget(budgets: GetPortfolioWithItems["budgets"]) {
    if (!budgets) {
        return 0
    }

    return budgets.reduce((total, budget) => total + budget.amount, 0)
}
