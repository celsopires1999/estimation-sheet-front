import { getBaseline } from "@/lib/queries/baselines"
import { getPortfoliosByBaselineId } from "@/lib/queries/portfolios"
import { PreliminariesTable } from "./PreliminariesTable"
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
        title: `Preliminaries for Baseline #${baselineId}`,
    }
}

export default async function PortfoliosPage({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    try {
        const baseline = await getBaseline(baselineId)
        const portfolios = await getPortfoliosByBaselineId(baselineId)
        const preliminaries = portfolios.filter(
            ({ plan_type }) => plan_type === PlanType.Preliminary,
        )

        return <PreliminariesTable baseline={baseline} data={preliminaries} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
