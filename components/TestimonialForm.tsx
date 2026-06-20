"use client"

import { useState } from "react"

export function TestimonialForm() {
  const [form, setForm] = useState({ fullName: "", role: "", company: "", rating: 5, message: "" })
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.fullName.trim().length < 2 || form.message.trim().length < 10) return
    setStatus("submitting")
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-ink/10 bg-paper p-7 text-center sm:p-9">
        <p className="font-[family-name:var(--font-display)] font-bold">Thank you.</p>
        <p className="mt-2 text-sm text-slate">
          Your feedback has been received and will be reviewed by our team.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-ink/10 bg-paper p-7 sm:p-9"
    >
      <div className="font-[family-name:var(--font-display)] text-lg font-bold">
        Leave BusyBrains Tech-Hub your feedback
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Your Name (e.g. Kola Ade)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          placeholder="Company Role (e.g. Lead Dev)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Company Name (e.g. Apex Ltd)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <select
          value={form.rating}
          onChange={(e) => update("rating", Number(e.target.value))}
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              Rating: {"★".repeat(r)}
              {"☆".repeat(5 - r)} ({r}/5)
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        rows={4}
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="Tell us about your experience collaborating with BusyBrains..."
        className="focus-ring mt-4 w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
      />

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">Could not save your feedback. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring mt-5 w-full rounded-sm bg-ink px-6 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit Testimonial"}
      </button>
    </form>
  )
}
