import { db } from "@/lib/db"

export type User = {
  id: number
  username: string
  password_hash: string
  created_at: string
}

export function createUser(username: string, passwordHash: string) {
  const result = db
    .prepare(
      `
      INSERT INTO users (username, password_hash)
      VALUES (?, ?)
    `
    )
    .run(username, passwordHash)

  return Number(result.lastInsertRowid)
}

export function getUserById(id: number) {
  return db
    .prepare(
      `
      SELECT id, username, password_hash, created_at
      FROM users
      WHERE id = ?
    `
    )
    .get(id) as User | undefined
}

export function getUserByUsername(username: string) {
  return db
    .prepare(
      `
      SELECT id, username, password_hash, created_at
      FROM users
      WHERE username = ?
    `
    )
    .get(username) as User | undefined
}
