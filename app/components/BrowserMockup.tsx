export default function BrowserMockup() {
  const links = [
    "GitHub",
    "YouTube",
    "Gmail",
    "Reddit",
    "ChatGPT",
    "Docs",
    "Calendar",
    "News",
  ]

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
      {/* Browser chrome */}
      <div className="border-b bg-muted/40">
        <div className="flex h-10 items-center gap-2 px-4">
          <span className="size-3 rounded-full border" />
          <span className="size-3 rounded-full border" />
          <span className="size-3 rounded-full border" />
        </div>

        <div className="flex items-center gap-3 px-4 pb-3">
          <span className="text-muted-foreground">←</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">↻</span>

          <div className="flex h-9 flex-1 items-center rounded-full border bg-background px-4 text-sm text-muted-foreground">
            links.marvinalegre.dev
          </div>
        </div>
      </div>

      {/* Links homepage */}
      <div className="min-h-[460px] px-8 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="text-3xl font-bold tracking-tight">Links</div>

            <div className="mt-2 text-sm text-muted-foreground">
              Curate your gateway to the web.
            </div>
          </div>

          {/* Search */}
          <div className="mx-auto mb-10 flex h-12 max-w-xl items-center rounded-full border bg-background px-5 shadow-sm">
            <span className="mr-3 text-muted-foreground">⌕</span>

            <span className="text-sm text-muted-foreground">Surf the web</span>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {links.map((link) => (
              <div
                key={link}
                className="flex h-24 items-center justify-center rounded-lg border bg-card text-sm font-medium transition hover:bg-muted"
              >
                {link}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
