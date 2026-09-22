"use client"

import Link from "next/link"
import { useState, useActionState } from "react"

import { signup } from "@/app/actions/auth"

const initialState = {
  errors: {},
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <main>
      <h1>Sign up</h1>

      {state.errors?.form && <small>{state.errors.form}</small>}

      <form
        action={formAction}
        onSubmit={() => (document.activeElement as HTMLElement)?.blur()}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        {state.errors?.username && <small>{state.errors.username}</small>}

        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {state.errors?.password && <small>{state.errors.password}</small>}

        <button type="submit" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  )
}
