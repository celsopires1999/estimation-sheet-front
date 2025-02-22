import { formatDecimal } from "@/lib/utils"

export function FormatDecimal({ value }: { value: unknown }) {
    let valueStr = undefined

    switch (typeof value) {
        case "string":
            valueStr = formatDecimal(value)
            break

        case "number":
            valueStr = formatDecimal(value)
            break

        default:
            valueStr = ""
            break
    }

    return <div className="text-right">{valueStr}</div>
}
