"use server"

import { z } from "zod"

import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { createUser, getUserByUsername } from "@/lib/auth/user"
import { redirect } from "next/navigation"

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be at most 32 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
})

type SignupState = {
  errors?: {
    username?: string
    password?: string
    form?: string
  }
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const username = formData.get("username")
  const password = formData.get("password")

  const result = signupSchema.safeParse({
    username,
    password,
  })

  if (!result.success) {
    const errors: SignupState["errors"] = {}

    for (const issue of result.error.issues) {
      const field = issue.path[0]

      if (field === "username" || field === "password") {
        errors[field] ??= issue.message
      }
    }

    return { errors }
  }

  const existingUser = getUserByUsername(result.data.username)

  if (existingUser) {
    return {
      errors: {
        username: "Username already exists",
      },
    }
  }

  const passwordHash = await hashPassword(result.data.password)

  try {
    const userId = createUser(result.data.username, passwordHash)

    await createSession(userId)
  } catch {
    return {
      errors: {
        form: "Something went wrong. Please try again.",
      },
    }
  }

  redirect("/")
}
