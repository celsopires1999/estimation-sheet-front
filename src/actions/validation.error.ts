export class ValidationError extends Error {}

export const ValidationErrorCodes = [400, 404, 409, 422]

export async function errorHandling(response: Response) {
    const e = await response.json()

    if (ValidationErrorCodes.includes(response.status)) {
        if (Array.isArray(e.message?.invalid_payload)) {
            const message = e.message.invalid_payload
                .map((error: { error: string }) => error.error)
                .join(", ")

            throw new ValidationError(message)
        }

        throw new ValidationError(e.message)
    }

    console.error(e)
    throw new Error(e.error)
}
