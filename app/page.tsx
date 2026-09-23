import { requireAuth } from "@/lib/auth/redirect"
import { logout } from "@/app/actions/auth"
import LinkForm from "./link-form"
import { Button } from "@/components/ui/button"
import { getLinks } from "@/lib/links/link"

export default async function HomePage() {
  const session = await requireAuth()
  const links = getLinks(session.user_id)

  return (
    <main>
      <h1>Links</h1>

      <LinkForm />

      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.title || link.url}</a>
          </li>
        ))}
      </ul>

      <form action={logout}>
        <Button type="submit">Log out</Button>
      </form>
    </main>
  )
}
