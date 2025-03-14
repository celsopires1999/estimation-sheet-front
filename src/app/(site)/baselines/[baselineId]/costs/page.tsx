import { getBaseline } from "@/lib/queries/baselines"
import { getCostsByBaselineId } from "@/lib/queries/costs"
import { CostTable } from "./CostTable"

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
        title: `Costs for Baseline #${baselineId}`,
    }
}

export default async function CostsPage({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    try {
        const baseline = await getBaseline(baselineId)
        const costs = await getCostsByBaselineId(baselineId)

        return <CostTable baseline={baseline} data={costs} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
