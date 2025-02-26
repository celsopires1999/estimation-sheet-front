export type GetUsersBody = {
    users: GetUser[]
}

export type GetUser = {
    user_id: string
    email: string
    user_name: string
    name: string
    user_type: string
    created_at: Date
    updated_at: Date | null
}

export type ManagerOption = {
    id: string
    description: string
}

export type SolutionArchitectOption = {
    id: string
    description: string
}
