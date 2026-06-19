"use client"

import { useMemo, useState } from "react"
import { SERVICE_CATEGORIES, RequestType, Urgency } from "@/lib/services"

type FormState = {
  fullName: string
  email: string
  phone: string
  companyName: string
  serviceCategoryId: string
  requestType: RequestType
  subject: string
  details: string
  preferredApproach: string
  urgency: Urgency
}

const initialState = (defaultCategory?: string): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  serviceCategoryId: defaultCategory ?? "",
  requestType: "service_request",
  subject: "",
  details: "",
  preferredApproach: "",
  urgency: "normal",
})

export default function GetStartedForm({ initialCategory }: { initialCategory?: string }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialState(initialCategory))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ referenceCode: string } | null>(null)

  const selectedCategory = useMemo(
    () => SERVICE_CATEGORIES.find((c) => c.id === form.serviceCategoryId),
    [form.serviceCategoryId]
  )

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function canProceedStep1() {
    return form.serviceCategoryId !== "" && form.requestType
  }

  function canProceedStep2() {
    return form.subject.trim().length > 3 && form.details.trim().length > 10
  }

  function canSubmit() {
    return form.fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit()) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.")
      }

      setResult({ referenceCode: data.referenceCode })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="mt-14 rounded-sm border border-ink/10 bg-ink p-8 text-paper sm:p-10">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
          Case opened
        </div>
        <div className="mt-3 font-[family-name:var(--font-mono)] text-3xl font-bold tracking-tight text-paper sm:text-4xl">
          {result.referenceCode}
        </div>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
          We've sent a confirmation to <strong className="text-paper">{form.email}</strong>.
          Our team has been notified and will review this case shortly. Keep
          your reference code for any follow-up.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-14">
      {/* Live reference code preview */}
      {selectedCategory && (
        <div
          key={selectedCategory.id}
          className="animate-ticker mb-8 flex items-center gap-3 rounded-sm border border-signal/30 bg-signal/10 px-4 py-3 font-[family-name:var(--font-mono)] text-sm"
        >
          <span className="text-slate">Reference will be issued as</span>
          <span className="font-bold text-ink">REQ-{selectedCategory.prefix}-XXXX</span>
        </div>
      )}

      {/* STEP 1: category + type */}
      <fieldset className="space-y-6">
        <legend className="font-[family-name:var(--font-display)] text-lg font-bold">
          1. What's this about?
        </legend>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink/80">
            Service category
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => update("serviceCategoryId", cat.id)}
                className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                  form.serviceCategoryId === cat.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest opacity-60">
                  {cat.prefix}
                </span>
                <div className="mt-0.5 font-medium">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink/80">
            What kind of request is this?
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => update("requestType", "complaint")}
              className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                form.requestType === "complaint"
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 hover:border-ink/40"
              }`}
            >
              <div className="font-medium">Report a problem</div>
              <div className="mt-0.5 text-xs opacity-70">
                Account breach, lost funds, something went wrong
              </div>
            </button>
            <button
              type="button"
              onClick={() => update("requestType", "service_request")}
              className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                form.requestType === "service_request"
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 hover:border-ink/40"
              }`}
            >
              <div className="font-medium">Request a service</div>
              <div className="mt-0.5 text-xs opacity-70">
                Need something built, installed, or delivered
              </div>
            </button>
          </div>
        </div>

        {form.requestType === "complaint" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-ink/80">
              How urgent is this?
            </label>
            <div className="flex flex-wrap gap-2">
              {(["low", "normal", "high", "urgent"] as Urgency[]).map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => update("urgency", u)}
                  className={`focus-ring rounded-sm border px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
                    form.urgency === u
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <button
            type="button"
            disabled={!canProceedStep1()}
            onClick={() => setStep(2)}
            className="focus-ring mt-2 rounded-sm bg-ink px-6 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continue →
          </button>
        )}
      </fieldset>

      {/* STEP 2: details */}
      {step >= 2 && (
        <fieldset className="mt-12 space-y-6 border-t border-ink/10 pt-10">
          <legend className="font-[family-name:var(--font-display)] text-lg font-bold">
            2. Give us the details
          </legend>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-ink/80">
              Short summary
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder={
                form.requestType === "complaint"
                  ? "e.g. Unauthorized transfer from my account"
                  : "e.g. New business website for my catering company"
              }
              className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
            />
          </div>

          <div>
            <label htmlFor="details" className="mb-2 block text-sm font-medium text-ink/80">
              Full details
            </label>
            <textarea
              id="details"
              rows={6}
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              placeholder="Walk us through exactly what happened, or what you need — the more detail, the faster we can route this."
              className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
            />
          </div>

          {form.requestType === "service_request" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/80">
                How should we approach it?
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    update("preferredApproach", "Client will specify exact requirements")
                  }
                  className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                    form.preferredApproach === "Client will specify exact requirements"
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  I'll specify exactly what I want
                </button>
                <button
                  type="button"
                  onClick={() => update("preferredApproach", "Let the team decide the approach")}
                  className={`focus-ring rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                    form.preferredApproach === "Let the team decide the approach"
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  Let your team decide what's best
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={!canProceedStep2()}
              onClick={() => setStep(3)}
              className="focus-ring mt-2 rounded-sm bg-ink px-6 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              Continue →
            </button>
          )}
        </fieldset>
      )}

      {/* STEP 3: contact info */}
      {step >= 3 && (
        <fieldset className="mt-12 space-y-6 border-t border-ink/10 pt-10">
          <legend className="font-[family-name:var(--font-display)] text-lg font-bold">
            3. How do we reach you?
          </legend>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-ink/80">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink/80">
                Phone <span className="text-slate">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-ink/80">
                Company <span className="text-slate">(optional)</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                className="focus-ring w-full rounded-sm border border-ink/15 bg-paper px-4 py-3 text-sm"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit() || submitting}
            className="focus-ring mt-2 rounded-sm bg-ink px-7 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            {submitting ? "Submitting…" : "Submit case"}
          </button>
        </fieldset>
      )}
    </form>
  )
}
