import { BackButton } from "@/components/BackButton"
import { getCompetence } from "@/lib/queries/competences"
import { CompetenceForm } from "./CompetenceForm"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { competenceId } = await searchParams

    if (!competenceId) {
        return {
            title: "New Competence",
        }
    }

    return {
        title: `Edit Competence #${competenceId}`,
    }
}

export default async function CompetenceFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { competenceId } = await searchParams

        if (competenceId) {
            const competence = await getCompetence(competenceId)

            if (!competence) {
                return (
                    <>
                        <h2 className="mb-2 text-2xl">
                            competence ID #{competenceId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            return <CompetenceForm key={competenceId} competence={competence} />
        } else {
            return <CompetenceForm key="new" />
        }
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
