import { BanIcon, ChartSplineIcon, CircleCheckBigIcon } from "lucide-react"

export function Inflation({ value }: { value: unknown }) {
    if (typeof value !== "boolean") {
        return (
            <div className="flex items-center gap-2">
                <ChartSplineIcon size={16} />
                {"undefined"}
            </div>
        )
    }

    if (!value) {
        return (
            <div className="flex items-center gap-2">
                <BanIcon size={16} className="text-red-600" />
                {"No"}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <CircleCheckBigIcon size={16} className="text-green-600" />
            {"Yes"}
        </div>
    )
}
