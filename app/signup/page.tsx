import Link from "next/link"
import { signup } from "@/app/actions/auth"

export default function SignupPage() {
  return (
    <main>
      <h1>Sign up</h1>

      <form action={signup}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />

        <button type="submit">Create account</button>
      </form>

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  )
}
