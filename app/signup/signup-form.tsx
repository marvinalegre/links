"use client"

import Link from "next/link"
import { useState, useActionState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { signup } from "@/app/actions/auth"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const initialState = {
  errors: {},
}

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showUsernameErr, setShowUsernameErr] = useState(true)
  const [showPasswordErr, setShowPasswordErr] = useState(true)
  const [showFormErr, setShowFormErr] = useState(true)

  useEffect(() => {
    setShowUsernameErr(true)
    setShowPasswordErr(true)
    setShowFormErr(true)
  }, [state])

  return (
    <main className="mx-auto flex w-full max-w-xs flex-col gap-8 px-4 pt-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>

      {state.errors?.form && showFormErr && (
        <small className="text-destructive">{state.errors.form}</small>
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
            aria-invalid={
              Boolean(state.errors?.username) &&
              showUsernameErr &&
              state.errors?.username !== "Username already exists"
            }
            disabled={pending}
            onChange={(e) => {
              setUsername(e.target.value)

              if (state.errors?.username) {
                setShowUsernameErr(false)
              }
              if (state.errors?.form) {
                setShowFormErr(false)
              }
            }}
          />
          {state.errors?.username && showUsernameErr && (
            <small
              className={cn(
                state.errors?.username !== "Username already exists"
                  ? "text-destructive"
                  : "text-amber-600"
              )}
            >
              {state.errors.username}
            </small>
          )}
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
              aria-invalid={Boolean(state.errors?.password) && showPasswordErr}
              disabled={pending}
              onChange={(e) => {
                setPassword(e.target.value)

                if (state.errors?.password) {
                  setShowPasswordErr(false)
                }
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

          {state.errors?.password && showPasswordErr && (
            <small className="text-destructive">{state.errors.password}</small>
          )}
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </main>
  )
}
