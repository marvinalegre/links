"use client"

import { useActionState } from "react"
import { login } from "@/app/actions/auth"

const initialState = { errors: {} }

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction}>
      <label>
        Username
        <input
          name="username"
          autoComplete="username"
          aria-invalid={!!state.errors?.username}
        />
      </label>

      {state.errors?.username && <small>{state.errors.username}</small>}

      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          aria-invalid={!!state.errors?.password}
        />
      </label>

      {state.errors?.password && <small>{state.errors.password}</small>}

      {state.errors?.form && <small>{state.errors.form}</small>}

      <button type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  )
}
