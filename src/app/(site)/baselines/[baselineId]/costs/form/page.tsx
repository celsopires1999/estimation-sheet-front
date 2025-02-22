import { BackButton } from "@/components/BackButton"
import { MonthOptions, YearsOptions } from "@/data"
import { getBaseline } from "@/lib/queries/baselines"
import { getCost } from "@/lib/queries/costs"
import { CostForm } from "./CostForm"

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { baselineId } = await params
    const { costId } = await searchParams

    if (!baselineId) {
        return {
            title: "Baseline Id missing",
        }
    }

    if (costId) {
        return {
            title: `Edit Cost #${costId} for Baseline #${baselineId}`,
        }
    }

    return {
        title: `New Cost for Baseline #${baselineId}`,
    }
}

export default async function CostFormPage({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { baselineId } = await params
        const { costId } = await searchParams

        if (!baselineId) {
            return (
                <>
                    <h2 className="mb-2 text-2xl">
                        Baseline ID required to load form
                    </h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }

        // if (baselineId) {
        const baseline = await getBaseline(baselineId)

        if (!baseline) {
            return (
                <>
                    <h2 className="mb-2 text-2xl">
                        baseline ID #{baselineId} not found
                    </h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }

        if (costId) {
            const cost = await getCost(baselineId, costId)
            return (
                <CostForm
                    key={costId}
                    baseline={baseline}
                    cost={cost}
                    years={YearsOptions}
                    months={MonthOptions}
                />
            )
        } else {
            return (
                <CostForm
                    key="new"
                    baseline={baseline}
                    years={YearsOptions}
                    months={MonthOptions}
                />
            )
        }
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
