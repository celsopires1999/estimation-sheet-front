import { BackButton } from "@/components/BackButton"
import { getPortfolio } from "@/lib/queries/portfolios"
import { PortfolioViewForm } from "./PortfolioViewForm"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ portfolioId: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { portfolioId } = await params

    if (!portfolioId) {
        return {
            title: "Portfolio Id missing",
        }
    }
    return {
        title: `Portfolio #${portfolioId} View`,
    }
}

export default async function PortfolioViewPage({
    params,
}: {
    params: Promise<{ portfolioId: string }>
}) {
    try {
        const { portfolioId } = await params

        if (!portfolioId) {
            return (
                <>
                    <h2 className="mb-2 text-2xl">
                        Portfolio ID required to load form
                    </h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }

        const portfolio = await getPortfolio(portfolioId)

        if (!portfolio) {
            return (
                <>
                    <h2 className="mb-2 text-2xl">
                        portfolio ID #{portfolioId} not found
                    </h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            )
        }
        return <PortfolioViewForm key={portfolioId} portfolio={portfolio} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
