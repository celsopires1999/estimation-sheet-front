import { BanIcon, ChartSplineIcon, CircleCheckBigIcon } from "lucide-react"

export function Inflation({ value }: { value: unknown }) {
    if (typeof value !== "boolean") {
        return (
            <div className="grid place-content-center">
                <ChartSplineIcon />
            </div>
        )
    }

    if (!value) {
        return (
            <div className="grid place-content-center">
                <BanIcon className="text-red-600" />
            </div>
        )
    }

    return (
        <div className="grid place-content-center">
            <CircleCheckBigIcon className="text-green-600" />
        </div>
    )
}
