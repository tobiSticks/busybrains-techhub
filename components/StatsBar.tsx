import { ScrollReveal } from "@/components/ScrollReveal"
import { SERVICE_CATEGORIES } from "@/lib/services"

// Every figure here must be true on its own (system guarantee or public
// record) — no projected/aspirational numbers (e.g. "120+ projects",
// "98% satisfaction") until we have real, verifiable data to back them.
const STATS = [
  { value: String(SERVICE_CATEGORIES.length), label: "Specialist disciplines, one case system" },
  { value: "100%", label: "Cases logged with a reference code" },
  { value: "RC 9584510", label: "CAC registered & active" },
  { value: "Abuja, FCT", label: "Nigerian headquarters" },
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
