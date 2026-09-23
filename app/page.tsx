import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"

export default function Page() {
  return (
    <>
      <h1>home page</h1>
      <form action={logout}>
        <Button type="submit">Log out</Button>
      </form>
    </>
  )
}
