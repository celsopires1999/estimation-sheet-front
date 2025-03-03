import { getMonthDescription } from "@/data"
import { CalendarIcon } from "lucide-react"

export function FormatStartDate({ value }: { value: unknown }) {
    if (typeof value !== "string") {
        return <p>No date</p>
    }

    const month = value ? getMonthDescription(value.substring(5, 7)) : null
    const year = value ? value.substring(0, 4) : null

    return (
        <div className="flex items-center gap-2">
            <CalendarIcon size={16} />
            {year} {month}
        </div>
    )
}
