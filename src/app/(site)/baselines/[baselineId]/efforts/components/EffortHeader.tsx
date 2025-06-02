import { BaselineNav } from "@/components/BaselineNav"
import { GetBaseline } from "@/models"

type Props = {
    title: string
    baseline?: GetBaseline
    children?: React.ReactNode
}

export function EffortHeader({ title, baseline, children }: Props) {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                <BaselineNav
                    baselineId={baseline?.baseline_id}
                    omit={children ? "efforts" : undefined}
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
