import {
    GetPortfolioWithItems,
    Portfolio,
    PortfoliosBody,
} from "@/models/portfolio"

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

export async function getPortfolio(
    portfolioID: string,
): Promise<GetPortfolioWithItems> {
    const response = await fetch(
        `${process.env.NEXT_API_URL}/portfolios/${portfolioID}`,
    )
    if (!response.ok) {
        throw new Error(`Failed to fetch Portfolio Id ${portfolioID}`)
    }
    const data: GetPortfolioWithItems = await response.json()

    return data
}
