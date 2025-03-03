import { ClockIcon } from "lucide-react"

export function FormatDateTime({ value }: { value: unknown }) {
    if (typeof value !== "string") {
        return (
            <div className="grid place-content-center">
                <ClockIcon size={16} />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <ClockIcon size={16} />
            {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
            })
                .format(new Date(value))
                .replace(",", " ")}
        </div>
    )
}
