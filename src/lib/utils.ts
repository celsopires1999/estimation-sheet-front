import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Decimal } from "decimal.js"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isValidDecimalWithPrecision(
    input: string,
    precision: number,
    scale: number,
): boolean {
    try {
        const decimal = new Decimal(input)

        // Check if the input has the specified precision and scale
        const [integerPart, fractionalPart] = decimal.toFixed().split(".")

        if (integerPart.length > precision - scale) {
            return false
        }

        if (fractionalPart && fractionalPart.length > scale) {
            return false
        }

        return true
    } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {
        return false
    }
}

export function isGreaterThanZero(value: string) {
    try {
        const valueDecimal = new Decimal(value)
        return valueDecimal.gt(0)
    } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {
        return false
    }
}

export function isGreaterThanOrEqualToZero(value: string) {
    try {
        const valueDecimal = new Decimal(value)
        return valueDecimal.gte(0)
    } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {
        return false
    }
}

export function toDecimal(value: string) {
    try {
        const valueDecimal = new Decimal(value)
        return valueDecimal
    } catch (error) /* eslint-disable-line  @typescript-eslint/no-unused-vars */ {
        return new Decimal(0)
    }
}

export function isValidNumber(
    input: string | number,
    inferiorLimit: number,
    superiorLimit: number,
) {
    let value: number

    if (typeof input === "string") {
        value = parseInt(input)

        if (isNaN(value)) {
            return false
        }
    } else {
        value = input
    }

    if (value < inferiorLimit || value > superiorLimit) {
        return false
    }

    return true
}

export function coarseInteger(value: string | number) {
    if (typeof value === "string") {
        return parseInt(value)
    }
    return value
}

export function formatDecimal(
    value: number | string | unknown,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
) {
    if (typeof value !== "string" && typeof value !== "number") {
        return ""
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(+value)
}
