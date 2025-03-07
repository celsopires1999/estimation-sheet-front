import { BaselineNav } from "@/components/BaselineNav"
import { getMonthDescription } from "@/data"
import { GetBaseline } from "@/models"

type Props = {
    title: string
    baseline?: GetBaseline
    children?: React.ReactNode
}

export function CostHeader({ title, baseline, children }: Props) {
    const month = baseline
        ? getMonthDescription(baseline?.start_date.substring(5, 7))
        : null
    const year = baseline ? baseline.start_date.substring(0, 4) : null

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <BaselineNav baselineId={baseline?.baseline_id} omit="costs" />
            </div>
            <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                    <h3>
                        {`${baseline?.code} / ${baseline?.review}: `}
                        <span className="truncate">{`${baseline?.title}`}</span>
                    </h3>
                    <div className="flex items-center gap-4">
                        <h3>
                            {`Starting on ${year} ${month}: ${baseline?.duration} months (duration)`}
                        </h3>
                        {children}
                    </div>
                </div>
                <hr className="w-full" />
            </div>
        </>
    )
}
