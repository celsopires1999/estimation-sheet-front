import { BackButton } from "@/components/BackButton"
import { getBaseline } from "@/lib/queries/baselines"
import { BaselineForm } from "./BaselineForm"
import { getUsers } from "@/lib/queries/users"
import { ManagerOption, SolutionArchitectOption } from "@/models"
import { MonthOptions, YearsOptions } from "@/data"

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

        const usersResult = await getUsers()

        const solutionArchitects: SolutionArchitectOption[] = usersResult.map(
            ({ user_id, name }) => ({ id: user_id, description: name }),
        )

        const managers: ManagerOption[] = usersResult
            .filter(({ user_type }) => user_type === "manager")
            .map(({ user_id, name }) => ({ id: user_id, description: name }))

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
