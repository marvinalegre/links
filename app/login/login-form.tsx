"use client"

import Link from "next/link"
import { useState, useActionState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/app/actions/auth"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const initialState = {
  errors: {},
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showFormErr, setShowFormErr] = useState(true)

  useEffect(() => {
    setShowFormErr(true)
  }, [state])

  return (
    <main className="mx-auto flex w-full max-w-xs flex-col gap-8 px-4 pt-16">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>

      {state.errors?.form && showFormErr && (
        <small className="text-amber-600">{state.errors.form}</small>
      )}

      <form
        action={formAction}
        className="flex flex-col gap-4"
        onSubmit={() => (document.activeElement as HTMLElement)?.blur()}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            required
            disabled={pending}
            onChange={(e) => {
              setUsername(e.target.value)

              if (state.errors?.form) {
                setShowFormErr(false)
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              required
              disabled={pending}
              onChange={(e) => {
                setPassword(e.target.value)

                if (state.errors?.form) {
                  setShowFormErr(false)
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={pending}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </main>
  )
}
