"use client"

import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) return
    setStatus("submitting")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return <p className="text-sm text-signal-soft">Subscribed — thanks for joining.</p>
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="myemail@firm.ng"
          className="focus-ring w-full rounded-sm border border-paper/20 bg-navy px-3 py-2 text-sm text-paper placeholder:text-paper/40"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring shrink-0 rounded-sm bg-signal px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-navy-deep transition-colors hover:bg-signal-soft disabled:opacity-50"
        >
          {status === "submitting" ? "..." : "Join"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-300">Could not subscribe. Try again.</p>
      )}
    </div>
  )
}
