"use server"

import { z } from "zod"

import { hashPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { createUser, getUserByUsername } from "@/lib/auth/user"

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

export async function signup(formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")

  const result = signupSchema.safeParse({
    username,
    password,
  })

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    }
  }

  const existingUser = getUserByUsername(result.data.username)

  if (existingUser) {
    return {
      error: "Username already exists",
    }
  }

  const passwordHash = await hashPassword(result.data.password)

  const user = createUser(result.data.username, passwordHash)

  if (!user) {
    return {
      error: "Failed to create account",
    }
  }

  await createSession(user.id)

  return {
    success: true,
  }
}
