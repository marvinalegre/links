"use client"

import { useActionState } from "react"

import { addLink } from "./actions/links"

const initialState = {
  errors: {},
}

export default function LinkForm() {
  const [state, formAction, pending] = useActionState(addLink, initialState)

  return (
    <form action={formAction} className="flex gap-2">
      <div className="flex-1">
        <input
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

      <button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add"}
      </button>
    </form>
  )
}
