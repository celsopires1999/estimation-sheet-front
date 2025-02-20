import { getBaselineSearchResults } from "@/lib/queries/baselines"
import { BaselineSearch } from "./BaselineSearch"
import { BaselineTable } from "./BaselineTable"

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
                <BaselineSearch searchText="" />
                <div className="mt-6 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Baselines List</h2>
                    <p className="mt-2">You can search by:</p>
                    <ul className="-mt-2 list-disc pl-6">
                        <li>Code</li>
                        <li>Title</li>
                        <li>Description</li>
                        <li>Manager</li>
                        <li>Solution Architect</li>
                    </ul>
                </div>
            </div>
        )
    }

    try {
        const results = await getBaselineSearchResults(searchText)
        return (
            <div>
                <BaselineSearch searchText={searchText} />
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
