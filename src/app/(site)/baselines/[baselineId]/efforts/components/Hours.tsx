import { formatDecimal } from "@/lib/utils"

export function Hours({ value }: { value: unknown }) {
    let valueStr = undefined

    switch (typeof value) {
        case "string":
            valueStr = formatDecimal(value, 0, 0)
            break

        case "number":
            valueStr = formatDecimal(value, 0, 0)
            break

        default:
            valueStr = ""
            break
    }

    return <div className="text-right">{valueStr}</div>
}
