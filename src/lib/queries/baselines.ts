import "server-only"

import { GetBaseline, GetBaselinesBody } from "@/models"

export async function getBaselineSearchResults(
    searchText: string,
): Promise<GetBaseline[]> {
    const response = await fetch(`${process.env.NEXT_API_URL}/baselines`)

    if (!response.ok) {
        throw new Error("Failed to fetch baselines")
    }

    const data: GetBaselinesBody = await response.json()

    if (searchText === "/") {
        return data.baselines
    }

    return data.baselines.filter((baseline) => {
        return (
            baseline.code.toLowerCase().includes(searchText.toLowerCase()) ||
            baseline.title.toLowerCase().includes(searchText.toLowerCase()) ||
            baseline.description
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            baseline.manager.toLowerCase().includes(searchText.toLowerCase()) ||
            baseline.estimator.toLowerCase().includes(searchText.toLowerCase())
        )
    })
}

export async function getBaseline(baselineID: string): Promise<GetBaseline> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/baselines/${baselineID}`,
    )
    if (!response.ok) {
        throw new Error("Failed to fetch baseline")
    }
    const data: GetBaseline = await response.json()
    return data
}
