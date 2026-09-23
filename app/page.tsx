import { logout } from "@/app/actions/auth"
import { deleteLink } from "./actions/links"
import { getLinks } from "@/lib/links/link"
import Landing from "@/app/components/Landing"
import { getSession } from "@/lib/auth/session"
import LinkForm from "./link-form"
import { DeleteButton } from "./components/DeleteButton"

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    return <Landing />
  }

  const links = getLinks(session.user_id)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>

        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Log out
          </button>
        </form>
      </header>

      <LinkForm />

      <section className="space-y-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border bg-muted/40 p-4 transition-colors hover:bg-muted/40"
          >
            <div className="font-medium">{link.title || link.url}</div>

            {link.title && (
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {link.url}
              </div>
            )}

            <div className="flex">
              <form action={deleteLink} className="ml-auto">
                <input type="hidden" name="id" value={link.id} />
                <DeleteButton />
              </form>
            </div>
          </a>
        ))}
      </section>
    </main>
  )
}
