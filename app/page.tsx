import { logout } from "@/app/actions/auth"
import { deleteLink } from "./actions/links"
import { getLinks } from "@/lib/links/link"
import Landing from "@/app/components/Landing"
import { getSession } from "@/lib/auth/session"
import LinkForm from "./link-form"
import { DeleteButton } from "./components/DeleteButton"
import { getUserById } from "@/lib/auth/user"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    return <Landing />
  }

  const links = getLinks(session.user_id)
  const user = getUserById(session.user_id)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          <Link href={`/${user?.username}`}>Links</Link>
        </h1>

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
          <div
            key={link.id}
            className="relative rounded-lg border bg-muted/40 p-4 transition-colors hover:bg-muted/40"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block pr-10"
            >
              <div className="font-medium">{link.title || link.url}</div>

              {link.title && (
                <div className="mt-1 truncate text-sm text-muted-foreground">
                  {link.url}
                </div>
              )}
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
                className="absolute top-2 right-2"
              >
                <MoreHorizontal />
                <span className="sr-only">Options</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <form action={deleteLink}>
                  <input type="hidden" name="id" value={link.id} />

                  <DropdownMenuItem
                    nativeButton
                    render={
                      <button type="submit" className="w-full text-left" />
                    }
                    variant="destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </section>
    </main>
  )
}
