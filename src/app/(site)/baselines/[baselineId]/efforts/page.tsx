import { getBaseline } from "@/lib/queries/baselines"
import { getEffortsByBaselineId } from "@/lib/queries/efforts"
import { EffortTable } from "./EffortTable"

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
        title: `Efforts for Baseline #${baselineId}`,
    }
}

export default async function EffortsPage({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    try {
        const baseline = await getBaseline(baselineId)
        const efforts = await getEffortsByBaselineId(baselineId)

        return <EffortTable baseline={baseline} data={efforts} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
