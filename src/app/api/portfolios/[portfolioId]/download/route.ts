import { getPortfolio } from "@/lib/queries/portfolios"
import {
    Budget,
    BudgetYearly,
    getCostTypeDescription,
    getPlanTypeDescription,
    Workload,
    WorkloadYearly,
} from "@/models"
import { type NextRequest } from "next/server"
import { utils, write } from "xlsx"

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ portfolioId: string }> },
) {
    const portfolioId = (await params).portfolioId

    try {
        const portfolioWithItems = await getPortfolio(portfolioId)
        if (!portfolioWithItems) {
            return writeErrorFile("portfolio not found")
        }

        const portfolio = {
            Potfolio: portfolioWithItems.code,
            Review: portfolioWithItems.review,
            "Plan Type": getPlanTypeDescription(portfolioWithItems.plan_type),
            "Plan Code": portfolioWithItems.plan_code,
            Title: portfolioWithItems.title,
            Description: portfolioWithItems.description,
            "Duration (Months)": portfolioWithItems.duration,
            Manager: portfolioWithItems.manager,
            Estimator: portfolioWithItems.estimator,
            "Start Date": portfolioWithItems.start_date,
            "Created At": portfolioWithItems.created_at,
        }

        const [firsYear, lastYear] = getYearsRange(
            portfolioWithItems.budgets,
            portfolioWithItems.workloads,
        )

        const budgets = portfolioWithItems.budgets?.map((budget) => {
            return {
                Potfolio: portfolioWithItems.code,
                Review: portfolioWithItems.review,
                "Plan Type": getPlanTypeDescription(
                    portfolioWithItems.plan_type,
                ),
                "Plan Code": portfolioWithItems.plan_code,
                "Cost Type": getCostTypeDescription(budget.cost_type),
                Description: budget.description,
                Comment: budget.comment,
                "Cost Amount": budget.cost_amount,
                "Cost Currency": budget.cost_currency,
                "Cost Tax": budget.cost_tax,
                "Cost Apply Inflation": budget.cost_apply_inflation
                    ? "Yes"
                    : "No",
                Amount: budget.amount,
                ...convertBudgetsToTimeline(
                    firsYear,
                    lastYear,
                    budget.budget_yearly,
                ),
            }
        })

        const workloads = portfolioWithItems.workloads?.map((workload) => {
            return {
                Potfolio: portfolioWithItems.code,
                Review: portfolioWithItems.review,
                "Plan Type": getPlanTypeDescription(
                    portfolioWithItems.plan_type,
                ),
                "Plan Code": portfolioWithItems.plan_code,
                "Competence Code": workload.competence_code,
                "Competence Name": workload.competence_name,
                Hours: workload.hours,
                ...convertWorkloadsToTimeline(
                    firsYear,
                    lastYear,
                    workload.workload_yearly,
                ),
            }
        })

        return writeExcelFile(
            [portfolio],
            budgets,
            workloads,
            portfolioWithItems.code,
        )
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return writeErrorFile(error.message)
        }
        console.error(error)
        return writeErrorFile("something went wrong")
    }
}

function writeExcelFile(
    portfolio: unknown[],
    budgets: unknown[],
    workloads: unknown[],
    code: string,
) {
    const headerWorksheet = utils.json_to_sheet(portfolio)
    const budgetsWorksheet = utils.json_to_sheet(budgets ?? [])
    const workloadsWorksheet = utils.json_to_sheet(workloads ?? [])

    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, headerWorksheet, "Porfolio")
    utils.book_append_sheet(workbook, budgetsWorksheet ?? [], "Budgets")
    utils.book_append_sheet(workbook, workloadsWorksheet ?? [], "Workloads")

    const buf = write(workbook, { type: "buffer", bookType: "xlsx" })

    const filename = code.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50)

    return new Response(buf, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
            "Content-Type": "application/vnd.ms-excel",
        },
    })
}

function writeErrorFile(error: string) {
    const errorWorksheet = utils.json_to_sheet([
        {
            error,
        },
    ])

    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, errorWorksheet, "Error")

    const buf = write(workbook, { type: "buffer", bookType: "xlsx" })

    return new Response(buf, {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="error.xlsx"`,
            "Content-Type": "application/vnd.ms-excel",
        },
    })
}

function getYearsRange(budgets: Budget[], workloads: Workload[]) {
    const budgetYears = budgets?.map((budget) => budget.budget_yearly) ?? []
    const workloadYears =
        workloads?.map((workload) => workload.workload_yearly) ?? []

    const years = new Set(
        [...budgetYears, ...workloadYears].flat().map((item) => item.year),
    )
    const sortedYears = [...years].sort((a, b) => a - b)
    return [sortedYears[0], sortedYears[sortedYears.length - 1]]
}

function convertBudgetsToTimeline(
    firstYear: number,
    lastYear: number,
    budgetYearly: BudgetYearly[],
) {
    const timeline: Record<string, number> = {}

    for (let year = firstYear; year <= lastYear; year++) {
        timeline["Year " + year] = 0
    }

    budgetYearly.forEach((budget) => {
        timeline["Year " + budget.year] = budget.amount
    })

    return timeline
}

function convertWorkloadsToTimeline(
    firstYear: number,
    lastYear: number,
    worloadYearly: WorkloadYearly[],
) {
    const timeline: Record<string, number> = {}

    for (let year = firstYear; year <= lastYear; year++) {
        timeline["Year " + year] = 0
    }

    worloadYearly.forEach((workload) => {
        timeline["Year " + workload.year] = workload.hours
    })

    return timeline
}
