import { z } from "zod"

export const saveCompetenceSchema = z.object({
    competence_id: z.union([
        z.string().uuid("invalid Competence Id"),
        z.literal("(New)"),
    ]),
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
})

export type SaveCompetenceType = z.infer<typeof saveCompetenceSchema>
