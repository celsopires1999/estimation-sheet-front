import { BackButton } from "@/components/BackButton"
import { getBaseline } from "@/lib/queries/baselines"
import { getPlanOptions } from "@/lib/queries/plans"
import { PortfolioForm } from "./PortfolioForm"
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
        title: `New Portfolio for Baseline #${baselineId}`,
    }
}

export default async function PortfolioFormPage({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { baselineId } = await params
        const { planType } = await searchParams

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

        const { preliminary, definitive } = await getPlanOptions()

        return (
            <PortfolioForm
                key={baselineId}
                baseline={baseline}
                plans={
                    planType === PlanType.Definitive ? definitive : preliminary
                }
                planType={planType}
            />
        )
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
