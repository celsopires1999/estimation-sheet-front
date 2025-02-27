export type User = {
    user_id: string
    email: string
    user_name: string
    name: string
    user_type: string
    created_at: Date
    updated_at: Date | null
}

export type GetUsersBody = {
    users: User[]
}

export type GetUser = User

export type CreateUser = Omit<User, "user_id" | "created_at" | "updated_at">

export type UpdateUser = Partial<
    Omit<User, "user_id" | "created_at" | "updated_at">
>

export type ManagerOption = {
    id: string
    description: string
}

export type SolutionArchitectOption = {
    id: string
    description: string
}

export const UserType = {
    Manager: "manager",
    "Solution Architect": "estimator",
} as const

export type UserType = (typeof UserType)[keyof typeof UserType]

export const UserTypeOptions = Object.entries(UserType).map(([key, value]) => ({
    id: value,
    description: key,
}))

export function getUserTypeDescription(userType: string | unknown) {
    let userTypeStr = ""

    if (typeof userType !== "string") {
        userTypeStr = String(userType)
    } else {
        userTypeStr = userType
    }

    const foundUserType = UserTypeOptions.find(
        (c) => c.id === userTypeStr,
    )?.description
    return foundUserType ?? ""
}
