import { BackButton } from "@/components/BackButton"
import { getPlan } from "@/lib/queries/plans"
import { PlanForm } from "./PlanForm"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { planId, copy } = await searchParams

    if (!planId) {
        return {
            title: "New Plan",
        }
    }

    if (!!copy && copy === "true") {
        return {
            title: "Copy Plan",
        }
    }

    return {
        title: `Edit Plan #${planId}`,
    }
}

export default async function PlanFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { planId, copy } = await searchParams

        if (planId) {
            const plan = await getPlan(planId)

            if (!plan) {
                return (
                    <>
                        <h2 className="mb-2 text-2xl">
                            plan ID #{planId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            return <PlanForm key={planId} plan={plan} copy={copy === "true"} />
        } else {
            return <PlanForm key="new" />
        }
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
