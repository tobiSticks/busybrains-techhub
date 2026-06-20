import { ScrollReveal } from "@/components/ScrollReveal"

// PLACEHOLDER — replace with real, verifiable figures before public launch.
const STATS = [
  { value: "—", label: "Security scans completed" },
  { value: "—", label: "Client satisfaction rate" },
  { value: "RC 9584510", label: "CAC registered & valid" },
  { value: "Abuja", label: "Active headquarters" },
]

export function StatsBar() {
  return (
    <section className="bg-navy-deep py-12 text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.06} className="text-center">
            <div className="font-[family-name:var(--font-mono)] text-2xl font-bold text-signal sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-paper/50">
              {s.label}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
