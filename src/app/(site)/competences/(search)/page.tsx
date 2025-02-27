import { CompetenceSearch } from "./CompetenceSearch"
import { getCompetenceSearchResults } from "@/lib/queries/competences"
import { CompetenceTable } from "./CompetenceTable"
import { ListSearch } from "@/components/ListSearch"

export const metadata = {
    title: "Competence Search",
}

export default async function CompetencesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams

    if (!searchText) {
        return (
            <div>
                <ListSearch
                    searchText=""
                    action="/competences"
                    placeholder="Search Competences"
                />
                <div className="mt-6 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Competences List</h2>
                    <p className="mt-2">You can search by:</p>
                    <ul className="-mt-2 list-disc pl-6">
                        <li>Code</li>
                        <li>Name</li>
                        <li>
                            Enter{" "}
                            <span className="font-bold">
                                {"/ (slash character)"}
                            </span>{" "}
                            for all competences
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    try {
        const results = await getCompetenceSearchResults(searchText)
        return (
            <div>
                <ListSearch
                    searchText={searchText}
                    action="/competences"
                    placeholder="Search Competences"
                />
                {results.length ? (
                    <CompetenceTable data={results} />
                ) : (
                    <p className="mt-4">No Competences found</p>
                )}
            </div>
        )
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
