export type GetBaselinesBody = {
    baselines: GetBaseline[]
}

export type GetBaseline = {
    baseline_id: string
    code: string
    review: number
    title: string
    description: string
    duration: number
    manager_id: string
    manager: string
    estimator_id: string
    estimator: string
    start_date: Date
    created_at: Date
    updated_at: Date | null
}

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
