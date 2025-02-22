import { getBaseline } from "@/lib/queries/baselines"
import { getCostsByBaselineId } from "@/lib/queries/costs"
import { CostTable } from "./CostTable"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    if (!baselineId) {
        return {
            title: "Baseline Id missing",
        }
    }

    return {
        title: `Costs for Baseline #${baselineId}`,
    }
}

export default async function CostsPage({
    params,
}: {
    params: Promise<{ baselineId: string }>
}) {
    const { baselineId } = await params

    // if (!searchText) {
    //     return (
    //         <div>
    //             <BaselineSearch searchText="" />
    //             <div className="mt-6 flex flex-col gap-4">
    //                 <h2 className="text-2xl font-bold">Baselines List</h2>
    //                 <p className="mt-2">You can search by:</p>
    //                 <ul className="-mt-2 list-disc pl-6">
    //                     <li>Code</li>
    //                     <li>Title</li>
    //                     <li>Description</li>
    //                     <li>Manager</li>
    //                     <li>Solution Architect</li>
    //                 </ul>
    //             </div>
    //         </div>
    //     )
    // }

    try {
        const baseline = await getBaseline(baselineId)
        const costs = await getCostsByBaselineId(baselineId)

        return <CostTable baseline={baseline} data={costs} />
    } catch (error) {
        if (error instanceof Error) {
            return <p className="mt-4">Error: ${error.message}</p>
        }

        return <p className="mt-4">Unexpected error</p>
    }
}
