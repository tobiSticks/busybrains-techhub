import { ScrollReveal } from "@/components/ScrollReveal"

// Badge subtitles are marketing copy, not certifications — swap for real
// certification names/badges once available.
const BADGES = [
  { title: "CAC Registered Company", subtitle: "RC Number: 9584510" },
  { title: "Secure-by-Design Practices", subtitle: "Modern security standards" },
  { title: "Innovation-Focused", subtitle: "Custom AI & fast web" },
  { title: "Responsive Client Support", subtitle: "Dedicated Abuja team" },
]

export function TrustBadges() {
  return (
    <section className="border-b border-ink/10 bg-paper-dim py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-slate">
          Corporate Trust Schemes &amp; Alignments
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b, i) => (
            <ScrollReveal
              key={b.title}
              delay={i * 0.06}
              className="rounded-sm border border-ink/10 bg-paper p-5 text-center"
            >
              <div className="font-[family-name:var(--font-display)] text-sm font-bold">
                {b.title}
              </div>
              <div className="mt-1 text-xs text-slate">{b.subtitle}</div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
