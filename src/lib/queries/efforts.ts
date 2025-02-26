import "server-only"

import { GetEffort, GetEffortsBody } from "@/models"

export async function getEffort(
    baselineID: string,
    effortID: string,
): Promise<GetEffort> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baselineID}/efforts/${effortID}`,
    )
    if (!response.ok) {
        throw new Error(
            `Failed to fetch effort Id ${effortID} for Baseline Id ${baselineID}`,
        )
    }
    const data: GetEffort = await response.json()
    return data
}

export async function getEffortsByBaselineId(
    baselineID: string,
): Promise<GetEffort[]> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baselineID}/efforts`,
    )
    if (!response.ok) {
        throw new Error(`Failed to fetch costs for Baseline Id ${baselineID}`)
    }
    const data: GetEffortsBody = await response.json()

    return data.efforts.map((effort) => effort)
}
