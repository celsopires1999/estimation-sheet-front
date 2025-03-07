import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

type Props = {
    baselineId?: string
    omit?: "baseline" | "costs" | "efforts" | "portfolios"
}

export function BaselineNav({ baselineId, omit }: Props) {
    return (
        <div className="flex">
            {omit === "baseline" ? null : (
                <Button variant="ghost" asChild>
                    <Link
                        href={`/baselines/form?baselineId=${baselineId}`}
                        className="flex w-full"
                        prefetch={false}
                    >
                        <span>Baseline</span>{" "}
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            )}

            {omit === "costs" ? null : (
                <Button variant="ghost" asChild>
                    <Link
                        href={`/baselines/${baselineId}/costs`}
                        className="flex w-full"
                        prefetch={false}
                    >
                        <span>Costs</span> <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            )}

            {omit === "efforts" ? null : (
                <Button variant="ghost" asChild>
                    <Link
                        href={`/baselines/${baselineId}/efforts`}
                        className="flex w-full"
                        prefetch={false}
                    >
                        <span>Efforts</span>{" "}
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            )}

            {omit === "portfolios" ? null : (
                <Button variant="ghost" asChild>
                    <Link
                        href={`/portfolios/baselines/${baselineId}`}
                        className="flex w-full"
                        prefetch={false}
                    >
                        <span>Portfolios</span>{" "}
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            )}
        </div>
    )
}
