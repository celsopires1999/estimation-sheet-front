import { getBaselineSearchResults } from "@/lib/queries/baselines"
import { BaselineTable } from "./BaselineTable"
import { ListSearch } from "@/components/ListSearch"

export const metadata = {
    title: "Baseline Search",
}

export default async function BaselinesPage({
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
                    action="/baselines"
                    placeholder="Search Baselines"
                />
                <div className="mt-6 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Baselines List</h2>
                    <p className="mt-2">You can search by:</p>
                    <ul className="-mt-2 list-disc pl-6">
                        <li>Code</li>
                        <li>Title</li>
                        <li>Description</li>
                        <li>Manager</li>
                        <li>Solution Architect</li>
                        <li>
                            Enter{" "}
                            <span className="font-bold">
                                {"/ (slash character)"}
                            </span>{" "}
                            for all baselines
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    try {
        const results = await getBaselineSearchResults(searchText)
        return (
            <div>
                <ListSearch
                    searchText={searchText}
                    action="/baselines"
                    placeholder="Search Baselines"
                />
                {results.length ? (
                    <BaselineTable data={results} />
                ) : (
                    <p className="mt-4">No Baselines found</p>
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
