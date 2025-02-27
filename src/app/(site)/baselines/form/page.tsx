import { BackButton } from "@/components/BackButton"
import { MonthOptions, YearsOptions } from "@/data"
import { getBaseline } from "@/lib/queries/baselines"
import { getUserOptions } from "@/lib/queries/users"
import { BaselineForm } from "./BaselineForm"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { baselineId } = await searchParams

    if (!baselineId) {
        return {
            title: "New Baseline",
        }
    }

    return {
        title: `Edit Baseline #${baselineId}`,
    }
}

export default async function BaselineFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { baselineId } = await searchParams

        const { solutionArchitects, managers } = await getUserOptions()

        if (baselineId) {
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

            return (
                <BaselineForm
                    key={baselineId}
                    baseline={baseline}
                    managers={managers}
                    solutionArchitects={solutionArchitects}
                    years={YearsOptions}
                    months={MonthOptions}
                />
            )
        } else {
            // new baseline form component
            return (
                <BaselineForm
                    key="new"
                    managers={managers}
                    solutionArchitects={solutionArchitects}
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
