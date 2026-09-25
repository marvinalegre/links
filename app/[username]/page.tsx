import LinkSearch from "@/app/components/LinkSearch"
import { getLinksByUsername } from "@/lib/links/link"
import Link from "next/link"

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const links = getLinksByUsername(username)

  return (
    <>
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-bold">
          <Link href="/">@{username}</Link>
        </h1>

        <LinkSearch links={links} />
      </main>
    </>
  )
}
