"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { addLink } from "./actions/links"
import { Input } from "@/components/ui/input"

const initialState = {
  errors: {},
}

export default function LinkForm() {
  const [state, formAction, pending] = useActionState(addLink, initialState)

  return (
    <form action={formAction} className="flex gap-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            autoFocus
            type="url"
            name="url"
            placeholder="Paste a URL..."
            disabled={pending}
            required
            aria-invalid={!!state.errors?.url}
            className="w-full p-5"
          />

          {pending && (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {state.errors?.url && (
          <small className="text-destructive">{state.errors.url}</small>
        )}

        {state.errors?.form && (
          <small className="text-destructive">{state.errors.form}</small>
        )}
      </div>
    </form>
  )
}
