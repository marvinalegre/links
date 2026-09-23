import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth/session"

export async function redirectIfAuthenticated() {
  const session = await getSession()

  if (session) {
    redirect("/")
  }
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
