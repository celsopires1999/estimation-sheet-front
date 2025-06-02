import { BaselineNav } from "@/components/BaselineNav"
import { PlanBadge } from "@/components/PlanBadge"
import { getMonthDescription } from "@/data"
import { GetBaseline } from "@/models"

type Props = {
    title: string
    baseline: GetBaseline
    planType?: string
    children?: React.ReactNode
}

export function PortfolioHeader({
    title,
    baseline,
    planType,
    children,
}: Props) {
    const month = baseline
        ? getMonthDescription(baseline?.start_date.substring(5, 7))
        : null
    const year = baseline ? baseline.start_date.substring(0, 4) : null

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <PlanBadge value={planType} />
                </div>
                <BaselineNav
                    baselineId={baseline?.baseline_id}
                    omit={title === "New Portfolio" ? undefined : "portfolios"}
                />
            </div>
            <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                    <h3>
                        {`${baseline?.code} / ${baseline?.review}: `}
                        <span className="truncate">{`${baseline?.title}`}</span>
                    </h3>
                    <div className="flex items-center gap-4">
                        <h3>{`Duration: ${baseline?.duration} months`}</h3>
                        {children}
                    </div>
                </div>
                <hr className="w-full" />
            </div>
        </>
    )
}
