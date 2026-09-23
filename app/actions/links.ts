"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAuth } from "@/lib/auth/redirect"
import { fetchTitle } from "@/lib/links/fetch-title"
import { createLink } from "@/lib/links/link"

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
