import BrowserMockup from "./BrowserMockup"

export default function Landing() {
  return (
    <main className="min-h-screen px-6">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-30 py-30">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">Links</h1>

          <p className="mt-6 text-2xl font-medium">
            Curate your gateway to the web.
          </p>

          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            A personal starting point for the websites you use every day.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <a
              href="/signup"
              className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground"
            >
              Sign up
            </a>

            <a href="/login" className="rounded-md border px-5 py-2.5">
              Log in
            </a>
          </div>
        </div>

        <div className="relative h-64 w-full max-w-3xl">
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background px-8 py-5 text-lg font-semibold shadow-sm">
            Links
          </div>

          <div className="absolute top-[20%] left-[15%] rounded-lg border bg-background px-5 py-3 shadow-sm">
            GitHub
          </div>

          <div className="absolute top-[20%] right-[15%] rounded-lg border bg-background px-5 py-3 shadow-sm">
            YouTube
          </div>

          <div className="absolute bottom-[15%] left-[8%] rounded-lg border bg-background px-5 py-3 shadow-sm">
            Reddit
          </div>

          <div className="absolute right-[8%] bottom-[15%] rounded-lg border bg-background px-5 py-3 shadow-sm">
            Gmail
          </div>

          <div className="absolute top-1/2 left-1/2 h-px w-[55%] -translate-x-1/2 bg-border" />
        </div>

        <BrowserMockup />
      </div>
    </main>
  )
}
