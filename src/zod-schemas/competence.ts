import { z } from "zod"

export const saveCompetenceSchema = z.object({
    competence_id: z.union([
        z.string().uuid("invalid Competence Id"),
        z.literal("(New)"),
    ]),
    code: z
        .string()
        .min(1, "Code is required")
        .max(20, "Code max length is 20 characters"),
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name max length is 50 characters"),
})

export type SaveCompetenceType = z.infer<typeof saveCompetenceSchema>
