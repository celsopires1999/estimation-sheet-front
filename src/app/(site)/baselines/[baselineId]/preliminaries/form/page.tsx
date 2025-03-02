import { BackButton } from "@/components/BackButton"
import { getBaseline } from "@/lib/queries/baselines"
import { getPlanOptions } from "@/lib/queries/plans"
import { PreliminaryForm } from "./PreliminaryForm"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { baselineId } = await params

    if (!baselineId) {
        return {
            title: "Baseline Id missing",
        }
    }
    return {
        title: `New Preliminary for Baseline #${baselineId}`,
    }
}

export default async function PreliminaryFormPage({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    try {
        const { baselineId } = await params

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

        const { preliminary } = await getPlanOptions()

        return (
            <PreliminaryForm
                key="new"
                baseline={baseline}
                plans={preliminary}
            />
        )
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
