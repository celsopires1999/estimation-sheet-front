import { formatInteger } from "@/lib/utils"

export function FormatInteger({ value }: { value: unknown }) {
    let valueStr = undefined

    switch (typeof value) {
        case "string":
            valueStr = formatInteger(value)
            break

        case "number":
            valueStr = formatInteger(value)
            break

        default:
            valueStr = ""
            break
    }

    return <div className="text-right">{valueStr}</div>
}
