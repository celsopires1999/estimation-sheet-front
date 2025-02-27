import { UserType } from "@/models"
import { z } from "zod"

export const saveUserSchema = z.object({
    user_id: z.union([z.string().uuid("invalid User Id"), z.literal("(New)")]),
    user_name: z.string().min(1, "User name is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    user_type: z.nativeEnum(UserType, {
        errorMap: () => ({ message: "Invalid cost type" }),
    }),
})

export type SaveUserType = z.infer<typeof saveUserSchema>
