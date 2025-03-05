import { Button } from "@/components/ui/button"
import { getMonthDescription } from "@/data"
import { GetBaseline } from "@/models"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

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
                <div className="flex">
                    <Button variant="ghost" asChild>
                        <Link
                            href={`/baselines/form?baselineId=${baseline?.baseline_id}`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Baseline</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link
                            href={`/baselines/${baseline?.baseline_id}/efforts`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Efforts</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link
                            href={`/portfolios/baselines/${baseline?.baseline_id}`}
                            className="flex w-full"
                            prefetch={false}
                        >
                            <span>Portfolios</span>{" "}
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
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
