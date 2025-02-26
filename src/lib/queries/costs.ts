import "server-only"

import { GetCost, GetCostsBody } from "@/models"

export async function getCost(
    baselineID: string,
    costID: string,
): Promise<GetCost> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baselineID}/costs/${costID}`,
    )
    if (!response.ok) {
        throw new Error(
            `Failed to fetch cost Id ${costID} for Baseline Id ${baselineID}`,
        )
    }
    const data: GetCost = await response.json()
    return data
}

export async function getCostsByBaselineId(
    baselineID: string,
): Promise<GetCost[]> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baselineID}/costs`,
    )
    if (!response.ok) {
        throw new Error(`Failed to fetch costs for Baseline Id ${baselineID}`)
    }
    const data: GetCostsBody = await response.json()

    return data.costs.map((cost) => cost)
}
