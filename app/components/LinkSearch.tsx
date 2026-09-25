"use client"

import { useMemo, useState } from "react"
import Fuse from "fuse.js"

type Link = {
  id: number
  title: string | null
  url: string
}

export default function LinkSearch({ links }: { links: Link[] }) {
  const [query, setQuery] = useState("")

  const fuse = useMemo(
    () =>
      new Fuse(links, {
        keys: ["title", "url"],
        threshold: 0.5,
      }),
    [links]
  )

  const results = query.trim()
    ? fuse.search(query).map((result) => result.item)
    : links

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search links..."
        className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2"
      />

      <div className="space-y-2">
        {results.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
          >
            <div className="font-medium">{link.title || link.url}</div>

            {link.title && (
              <div className="text-sm text-muted-foreground">{link.url}</div>
            )}
          </a>
        ))}

        {results.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No links found.
          </p>
        )}
      </div>
    </div>
  )
}
