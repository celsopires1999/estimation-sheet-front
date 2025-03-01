import { UserType } from "@/models"
import { z } from "zod"

export const saveUserSchema = z.object({
    user_id: z.union([z.string().uuid("invalid User Id"), z.literal("(New)")]),
    user_name: z
        .string()
        .min(1, "User name is required")
        .max(8, "User name max length is 8 characters"),
    name: z
        .string()
        .min(1, "Name is required")
        .max(50, "Name max length is 50 characters"),
    email: z
        .string()
        .email("Invalid email")
        .max(255, "Email max length is 255 characters"),
    user_type: z.nativeEnum(UserType, {
        errorMap: () => ({ message: "Invalid cost type" }),
    }),
})

export type SaveUserType = z.infer<typeof saveUserSchema>
