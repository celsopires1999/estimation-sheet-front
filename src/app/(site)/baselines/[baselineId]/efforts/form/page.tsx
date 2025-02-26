import { BackButton } from "@/components/BackButton"
import { MonthOptions, YearsOptions } from "@/data"
import { getBaseline } from "@/lib/queries/baselines"
import { getEffort } from "@/lib/queries/efforts"
import { EffortForm } from "./EffortForm"
import { getCompetences } from "@/lib/queries/competences"
import { CompetenceOption } from "@/models"

export async function generateMetadata({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { baselineId } = await params
    const { effortId } = await searchParams

    if (!baselineId) {
        return {
            title: "Baseline Id missing",
        }
    }

    if (effortId) {
        return {
            title: `Edit Effort #${effortId} for Baseline #${baselineId}`,
        }
    }

    return {
        title: `New Effort for Baseline #${baselineId}`,
    }
}

export default async function EffortFormPage({
    params,
    searchParams,
}: {
    params: Promise<{ baselineId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { baselineId } = await params
        const { effortId } = await searchParams

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

        const competencesResult = await getCompetences()

        const competences: CompetenceOption[] = competencesResult.map(
            ({ competence_id, code }) => ({
                id: competence_id,
                description: code,
            }),
        )

        if (effortId) {
            const effort = await getEffort(baselineId, effortId)
            return (
                <EffortForm
                    key={effortId}
                    baseline={baseline}
                    effort={effort}
                    competences={competences}
                    years={YearsOptions}
                    months={MonthOptions}
                />
            )
        } else {
            return (
                <EffortForm
                    key="new"
                    baseline={baseline}
                    competences={competences}
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
