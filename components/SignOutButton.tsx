"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="focus-ring rounded-sm border border-ink/20 px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors hover:border-ink"
    >
      Sign out
    </button>
  )
}
