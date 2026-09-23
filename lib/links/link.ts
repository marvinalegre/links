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

export type Link = {
  id: number
  title: string
  url: string
}

export function getLinksByUsername(username: string): Link[] {
  return db
    .prepare(
      `
      SELECT links.id, links.title, links.url
      FROM links
      JOIN users ON users.id = links.user_id
      WHERE users.username = ?
      ORDER BY links.id DESC
    `
    )
    .all(username) as Link[]
}
