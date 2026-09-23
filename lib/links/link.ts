import { db } from "@/lib/db"

export function createLink({
  userId,
  url,
  title,
}: {
  userId: number
  url: string
  title: string | null
}) {
  db.prepare(
    `
    INSERT INTO links (user_id, url, title)
    VALUES (?, ?, ?)
  `
  ).run(userId, url, title)
}

export function getLinks(userId: number) {
  return db
    .prepare(
      `
      SELECT id, title, url
      FROM links
      WHERE user_id = ?
      ORDER BY created_at DESC
    `
    )
    .all(userId) as {
    id: number
    title: string | null
    url: string
  }[]
}
