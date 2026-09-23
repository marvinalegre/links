"use client"

import { useState } from "react"

type Link = {
  id: number
  title: string | null
  url: string
}

export default function LinkSearch({ links }: { links: Link[] }) {
  const [query, setQuery] = useState("")

  const results = links.filter((link) => {
    const q = query.toLowerCase().trim()

    if (!q) return true

    return (
      (link.title ?? "").toLowerCase().includes(q) ||
      link.url.toLowerCase().includes(q)
    )
  })

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
