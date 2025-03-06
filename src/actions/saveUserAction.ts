"use server"

import { actionClient } from "@/lib/safe-action"
import { CreateUser, UpdateUser } from "@/models"
import { saveUserSchema, SaveUserType } from "@/zod-schemas/user"
import { flattenValidationErrors } from "next-safe-action"
import { cookies } from "next/headers"
import { errorHandling } from "./validation.error"

export const saveUserAction = actionClient
    .metadata({ actionName: "saveUserAction" })
    .schema(saveUserSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({ parsedInput: user }: { parsedInput: SaveUserType }) => {
        if (user.user_id === "(New)") {
            return await createUser(user)
        } else {
            return await updateUser(user)
        }
    })

async function createUser(input: SaveUserType) {
    const user: CreateUser = {
        user_name: input.user_name,
        email: input.email,
        user_type: input.user_type,
        name: input.name,
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { user_id }: { user_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `User ID #${user_id} created successfully`,
        user_id: user_id,
    }
}

async function updateUser(input: SaveUserType) {
    const user: UpdateUser = {
        user_name: input.user_name,
        email: input.email,
        user_type: input.user_type,
        name: input.name,
    }

    const response = await fetch(
        `${process.env.NEXT_API_URL}/users/${input.user_id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        },
    )
    if (!response.ok) {
        await errorHandling(response)
    }

    const data = await response.json()

    const { user_id }: { user_id: string } = data

    // force client to refresh the page
    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return {
        message: `User ID #${user_id} updated successfully`,
        user_id: user_id,
    }
}
