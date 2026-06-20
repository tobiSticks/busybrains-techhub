import Link from "next/link"

// PLACEHOLDER — swap the silhouette panel for a real client project photo
// once the first case study is ready to publish.
export function CaseStudyCard() {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-sm border border-ink/10 sm:grid-cols-2">
      <div className="bg-gradient-to-br from-navy-deep to-navy p-9 text-paper sm:p-12">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
          Case Study
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight">
          Your project could be featured here
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
          We&apos;re documenting our first client deployments for publication.
          Start a project with us now and be among the first case studies we
          share.
        </p>
        <Link
          href="/get-started"
          className="focus-ring mt-7 inline-flex items-center gap-2 rounded-sm bg-paper px-5 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-navy-deep transition-colors hover:bg-signal"
        >
          Start a project →
        </Link>
      </div>

      <div className="relative flex min-h-[260px] items-center justify-center bg-paper-dim">
        <svg viewBox="0 0 200 200" className="h-32 w-32 text-ink/15" fill="currentColor" aria-hidden>
          <circle cx="100" cy="70" r="40" />
          <path d="M30 190c0-50 31-80 70-80s70 30 70 80z" />
        </svg>
        <span className="absolute bottom-4 right-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-slate">
          Placeholder image
        </span>
      </div>
    </div>
  )
}
