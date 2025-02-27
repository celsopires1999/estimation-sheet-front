import { getUserSearchResults } from "@/lib/queries/users"
import { UserTable } from "./UserTable"
import { ListSearch } from "@/components/ListSearch"

export const metadata = {
    title: "User Search",
}

export default async function UsersPage({
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
                    action="/users"
                    placeholder="Search Users"
                />
                <div className="mt-6 flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Users List</h2>
                    <p className="mt-2">You can search by:</p>
                    <ul className="-mt-2 list-disc pl-6">
                        <li>Email</li>
                        <li>User Name</li>
                        <li>Name</li>
                        <li>
                            Enter{" "}
                            <span className="font-bold">
                                {"/ (slash character)"}
                            </span>{" "}
                            for all users
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    try {
        const results = await getUserSearchResults(searchText)
        return (
            <div>
                <ListSearch
                    searchText={searchText}
                    action="/users"
                    placeholder="Search Users"
                />
                {results.length ? (
                    <UserTable data={results} />
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
