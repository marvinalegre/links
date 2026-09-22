import { redirect } from "next/navigation"

import { getUserById } from "@/lib/auth/user"
import { getSession } from "@/lib/auth/session"

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) return null

  return getUserById(session.user_id) ?? null
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
