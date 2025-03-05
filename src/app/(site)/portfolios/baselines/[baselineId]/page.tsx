import { getBaseline } from "@/lib/queries/baselines"
import { getPortfoliosByBaselineId } from "@/lib/queries/portfolios"
import { PortfoliosTable } from "./PortfoliosTable"

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
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    try {
        const baseline = await getBaseline(baselineId)
        const portfolios = await getPortfoliosByBaselineId(baselineId)

        return <PortfoliosTable baseline={baseline} data={portfolios} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
