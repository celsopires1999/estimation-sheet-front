import { GetUser, GetUsersBody } from "@/models"

export async function getUsers(): Promise<GetUser[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/users?sort=name`)
    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }
    const data: GetUsersBody = await response.json()
    return data.users
}
