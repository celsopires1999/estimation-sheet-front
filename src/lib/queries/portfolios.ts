import { Portfolio, PortfoliosBody } from "@/models/portfolio"

export async function getPortfoliosByBaselineId(
    baselineID: string,
): Promise<Portfolio[]> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/portfolios?baselineID=${baselineID}`,
    )
    if (!response.ok) {
        throw new Error(
            `Failed to fetch portfolios for Baseline Id ${baselineID}`,
        )
    }
    const data: PortfoliosBody = await response.json()

    return data.portfolios
}
