import "server-only"

import { Plan, GetPlansBody } from "@/models"

export async function getPlanSearchResults(
    searchText: string,
): Promise<Plan[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/plans`)

    if (!response.ok) {
        throw new Error("Failed to fetch plans")
    }

    const data: GetPlansBody = await response.json()

    if (searchText === "/") {
        return data.plans
    }

    return data.plans.filter((plan) => {
        return (
            plan.code.toLowerCase().includes(searchText.toLowerCase()) ||
            plan.name.toLowerCase().includes(searchText.toLowerCase())
        )
    })
}

export async function getPlan(planID: string): Promise<Plan> {
    const response = await fetch(`${process.env.NEXT_API_URL}/plans/${planID}`)
    if (!response.ok) {
        throw new Error("Failed to fetch plan")
    }
    const data: Plan = await response.json()
    return data
}

export async function getPlans(): Promise<Plan[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/plans`)
    if (!response.ok) {
        throw new Error("Failed to fetch plans")
    }
    const data: GetPlansBody = await response.json()
    return data.plans
}
