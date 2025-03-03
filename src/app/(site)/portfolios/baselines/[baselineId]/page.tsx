import { getBaseline } from "@/lib/queries/baselines"
import { getPortfoliosByBaselineId } from "@/lib/queries/portfolios"
import { PortfoliosTable } from "./PortfoliosTable"
import { PlanType } from "@/models"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    if (!baselineId) {
        return {
            title: "Baseline Id missing",
        }
    }

    return {
        title: `Portfolios for Baseline #${baselineId}`,
    }
}

export default async function PortfoliosByBaselinePage({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { baselineId } = await params
    const { planType } = await searchParams

    const planTypeFilter = planType
        ? planType === PlanType.Definitive
            ? PlanType.Definitive
            : PlanType.Preliminary
        : PlanType.Preliminary

    try {
        const baseline = await getBaseline(baselineId)
        const portfolios = await getPortfoliosByBaselineId(baselineId)
        const filteredPortfolios = portfolios.filter(
            ({ plan_type }) => plan_type === planTypeFilter,
        )

        return <PortfoliosTable baseline={baseline} data={filteredPortfolios} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
