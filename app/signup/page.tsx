import { redirectIfAuthenticated } from "@/lib/auth/redirect"
import SignupForm from "./signup-form"

export default async function SignupPage() {
  await redirectIfAuthenticated()

  return <SignupForm />
}
