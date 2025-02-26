export function Description({ value }: { value: unknown }) {
    const valueStr = typeof value === "string" ? value : value?.toString()

    return <p className="max-w-80 truncate">{valueStr}</p>
}
