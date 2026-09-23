"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth/session"
import { requireAuth } from "@/lib/auth/redirect"
import { fetchTitle } from "@/lib/links/fetch-title"
import { createLink } from "@/lib/links/link"
import { revalidatePath } from "next/cache"

const linkSchema = z.object({
  url: z.url("Invalid URL"),
})

type AddLinkState = {
  errors?: {
    url?: string
    form?: string
  }
}

export async function addLink(
  _prevState: AddLinkState,
  formData: FormData
): Promise<AddLinkState> {
  const result = linkSchema.safeParse({
    url: formData.get("url"),
  })

  if (!result.success) {
    return {
      errors: {
        url: result.error.issues[0]?.message,
      },
    }
  }

  const session = await requireAuth()

  const title = await fetchTitle(result.data.url)

  try {
    createLink({
      userId: session.user_id,
      url: result.data.url,
      title,
    })
  } catch {
    return {
      errors: {
        form: "Something went wrong. Please try again.",
      },
    }
  }

  redirect("/")
}

export async function deleteLink(formData: FormData) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const id = Number(formData.get("id"))

  db.prepare("DELETE FROM links WHERE id = ? AND user_id = ?").run(
    id,
    session.user_id
  )

  revalidatePath("/")
}
