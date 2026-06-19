import Link from "next/link"

export const metadata = {
  title: "Contact — BusyBrains Tech-Hub",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
        Contact
      </div>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
        Reach the team
      </h1>
      <p className="mt-5 max-w-md text-slate">
        For anything that needs a tracked record — complaints, project requests,
        quotes — use the case form. It's faster for us to route and you'll get
        a reference code immediately.
      </p>

      <div className="mt-10">
        <Link
          href="/get-started"
          className="focus-ring inline-block rounded-sm bg-ink px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
        >
          Open a case
        </Link>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
        <div className="bg-paper p-7">
          <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
            Email
          </div>
          <div className="mt-2 text-ink">info@busybrainstech-hub.com.ng</div>
        </div>
        <div className="bg-paper p-7">
          <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
            Phone
          </div>
          <div className="mt-2 text-ink">+234 816 116 4007</div>
        </div>
      </div>
    </div>
  )
}
