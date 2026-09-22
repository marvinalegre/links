import { randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex")
  const expiresAt = Date.now() + SESSION_DURATION

  db.prepare(
    `
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `
  ).run(id, userId, expiresAt)

  const cookieStore = await cookies()

  cookieStore.set("session", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const id = cookieStore.get("session")?.value

  if (!id) return null

  const session = db
    .prepare(
      `
    SELECT
      sessions.id,
      sessions.user_id,
      sessions.expires_at,
      users.username
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ?
  `
    )
    .get(id) as
    | {
        id: string
        user_id: number
        expires_at: number
        username: string
      }
    | undefined

  if (!session) return null

  if (session.expires_at <= Date.now()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(id)
    return null
  }

  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const id = cookieStore.get("session")?.value

  if (id) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(id)
  }

  cookieStore.delete("session")
}
