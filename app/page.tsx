import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import { requireAuth } from "@/lib/auth/redirect"

export default async function Page() {
  await requireAuth()

  return (
    <>
      <h1>home page</h1>
      <form action={logout}>
        <Button type="submit">Log out</Button>
      </form>
    </>
  )
}
