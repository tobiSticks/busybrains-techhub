"use client"

import { useState } from "react"

const SERVICE_OPTIONS: { label: string; categoryId: string }[] = [
  { label: "Website development", categoryId: "software-it" },
  { label: "Cybersecurity Audit", categoryId: "cybersecurity" },
  { label: "AI System Integration", categoryId: "ai-automation" },
  { label: "Business Automation", categoryId: "ai-automation" },
  { label: "Corporate Group Training", categoryId: "training-consultancy" },
  { label: "Co-working reservations", categoryId: "business-corporate" },
]

const TIMELINES = ["Within 1 Month", "Within 3 Months", "3 to 6 Months", "Flexible / Ongoing"]
const BUDGETS = ["Under 1M NGN", "1M - 3M NGN", "3M - 5M NGN", "Above 5M NGN"]

export function QuoteForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [services, setServices] = useState<string[]>([])
  const [scope, setScope] = useState("")
  const [timeline, setTimeline] = useState(TIMELINES[0])
  const [budget, setBudget] = useState(BUDGETS[0])
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")
  const [result, setResult] = useState<string | null>(null)

  function toggleService(label: string) {
    setServices((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]))
  }

  function canSubmit() {
    return (
      fullName.trim().length > 1 &&
      /\S+@\S+\.\S+/.test(email) &&
      services.length > 0 &&
      scope.trim().length > 10
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit()) return
    setStatus("submitting")

    const firstCategory =
      SERVICE_OPTIONS.find((o) => o.label === services[0])?.categoryId || "business-corporate"

    const details = `Services requested: ${services.join(", ")}
Estimated budget: ${budget}
Desired timeline: ${timeline}

Scope:
${scope}`

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          companyName: company || undefined,
          serviceCategoryId: firstCategory,
          requestType: "service_request",
          subject: "Project quote request",
          details,
          urgency: "normal",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setResult(data.referenceCode)
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-ink/10 bg-navy p-7 text-paper sm:p-9">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
          Quote request received
        </div>
        <div className="mt-3 font-[family-name:var(--font-mono)] text-2xl font-bold">{result}</div>
        <p className="mt-3 text-sm leading-relaxed text-paper/70">
          We&apos;ll review your scope and reach out at {email} with next steps.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-ink/10 bg-paper p-7 sm:p-9">
      <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
        Request a Project Quote
      </div>
      <p className="mt-1 text-sm text-slate">
        Formalize your development, AI project, or cybersecurity scope.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your Name"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Official Email"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (WhatsApp preferred)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-ink/80">
          Which services are required? (check all that apply)
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.label}
              onClick={() => toggleService(opt.label)}
              className={`focus-ring rounded-sm border px-4 py-2.5 text-left text-sm transition-all ${
                services.includes(opt.label)
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 hover:border-ink/40 hover:-translate-y-0.5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="scope" className="mb-2 block text-sm font-medium text-ink/80">
          Scope briefing &amp; technical specifications
        </label>
        <textarea
          id="scope"
          required
          rows={4}
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder="Describe your business assets and what you'd like delivered."
          className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/80">Desired project timeline</label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/80">Estimated budget (NGN)</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not submit your request. Please try again shortly.
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit() || status === "submitting"}
        className="focus-ring mt-5 w-full rounded-sm bg-ink px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        {status === "submitting" ? "Submitting…" : "Submit Cost Quote Request"}
      </button>
    </form>
  )
}
