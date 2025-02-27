import "server-only"

import {
    GetUser,
    GetUsersBody,
    ManagerOption,
    SolutionArchitectOption,
    User,
    UserType,
} from "@/models"

export async function getUserSearchResults(
    searchText: string,
): Promise<User[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/users?sort=name`)

    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }

    const data: GetUsersBody = await response.json()

    if (searchText === "/") {
        return data.users
    }

    return data.users.filter((user) => {
        return (
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.name.toLowerCase().includes(searchText.toLowerCase())
        )
    })
}

export async function getUser(userID: string): Promise<User> {
    const response = await fetch(`${process.env.NEXT_API_URL}/users/${userID}`)
    if (!response.ok) {
        throw new Error("Failed to fetch user")
    }
    const data: User = await response.json()
    return data
}

export async function getUsers(): Promise<GetUser[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/users?sort=name`)
    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }
    const data: GetUsersBody = await response.json()
    return data.users
}

export async function getUserOptions() {
    const users = await getUsers()

    const solutionArchitects: SolutionArchitectOption[] = users.map(
        ({ user_id, name }) => ({ id: user_id, description: name }),
    )
    const managers: ManagerOption[] = users
        .filter(({ user_type }) => user_type === UserType.Manager)
        .map(({ user_id, name }) => ({ id: user_id, description: name }))

    return { solutionArchitects, managers }
}
