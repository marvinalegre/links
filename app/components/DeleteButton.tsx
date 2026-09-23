"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  )
}
