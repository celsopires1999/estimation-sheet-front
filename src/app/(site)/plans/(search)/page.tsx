import { ListSearch } from "@/components/ListSearch"
import { getPlanSearchResults } from "@/lib/queries/plans"
import { PlanTable } from "./PlanTable"

export const metadata = {
    title: "Plan Search",
}

export default async function PlansPage({
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
                    action="/plans"
                    placeholder="Search Plans"
                />
                <div className="mt-6 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Plans List</h2>
                    <p className="mt-2">You can search by:</p>
                    <ul className="-mt-2 list-disc pl-6">
                        <li>Code</li>
                        <li>Name</li>
                        <li>
                            Enter{" "}
                            <span className="font-bold">
                                {"/ (slash character)"}
                            </span>{" "}
                            for all plans
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    try {
        const results = await getPlanSearchResults(searchText)
        return (
            <div>
                <ListSearch
                    searchText={searchText}
                    action="/users"
                    placeholder="Search Users"
                />
                {results.length ? (
                    <PlanTable data={results} />
                ) : (
                    <p className="mt-4">No Users found</p>
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
