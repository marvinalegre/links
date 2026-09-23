"use client"

import { useActionState } from "react"

import { addLink } from "./actions/links"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState = {
  errors: {},
}

export default function LinkForm() {
  const [state, formAction, pending] = useActionState(addLink, initialState)

  return (
    <form action={formAction} className="flex gap-2">
      <div className="flex-1">
        <Input
          type="url"
          name="url"
          placeholder="Paste a URL..."
          required
          aria-invalid={!!state.errors?.url}
          className="w-full"
        />

        {state.errors?.url && (
          <small className="text-destructive">{state.errors.url}</small>
        )}

        {state.errors?.form && (
          <small className="text-destructive">{state.errors.form}</small>
        )}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
