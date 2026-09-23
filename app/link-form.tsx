"use client"

import { useActionState } from "react"

import { addLink } from "./actions/links"

const initialState = {
  errors: {},
}

export default function LinkForm() {
  const [state, formAction, pending] = useActionState(addLink, initialState)

  return (
    <form action={formAction}>
      <label>
        URL
        <input
          type="url"
          name="url"
          placeholder="https://example.com"
          required
          aria-invalid={!!state.errors?.url}
        />
      </label>

      {state.errors?.url && <small>{state.errors.url}</small>}

      {state.errors?.form && <small>{state.errors.form}</small>}

      <button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add link"}
      </button>
    </form>
  )
}
