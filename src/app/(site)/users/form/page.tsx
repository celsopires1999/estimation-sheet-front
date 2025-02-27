import { BackButton } from "@/components/BackButton"
import { getUser } from "@/lib/queries/users"
import { UserForm } from "./UserForm"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { userId } = await searchParams

    if (!userId) {
        return {
            title: "New User",
        }
    }

    return {
        title: `Edit User #${userId}`,
    }
}

export default async function UserFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {
        const { userId } = await searchParams

        if (userId) {
            const user = await getUser(userId)

            if (!user) {
                return (
                    <>
                        <h2 className="mb-2 text-2xl">
                            user ID #{userId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                )
            }

            return <UserForm key={userId} user={user} />
        } else {
            return <UserForm key="new" />
        }
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
