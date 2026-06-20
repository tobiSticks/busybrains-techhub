"use client"

import { useState } from "react"

export function MessageForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")

  function canSubmit() {
    return fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && message.trim().length > 5
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit()) return
    setStatus("submitting")
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          serviceCategoryId: "business-corporate",
          requestType: "service_request",
          subject: "General enquiry",
          details: message,
          urgency: "normal",
        }),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-ink/10 bg-paper p-7">
        <p className="font-[family-name:var(--font-display)] font-bold">Message sent.</p>
        <p className="mt-2 text-sm text-slate">
          We&apos;ve received it and will get back to you at {email}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-ink/10 bg-paper p-7">
      <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
        Leave a Message
      </div>
      <p className="mt-1 text-sm text-slate">
        General enquiries, career openings, or co-working space support.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60 sm:col-span-2"
        />
      </div>

      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="My request or message"
        className="focus-ring mt-4 w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
      />

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">Could not send your message. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit() || status === "submitting"}
        className="focus-ring mt-4 w-full rounded-sm border border-ink/20 px-6 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}
