import { SERVICE_CATEGORIES } from "@/lib/services"

export function ServiceMarquee() {
  const items = SERVICE_CATEGORIES.map((c) => c.name)

  return (
    <div className="overflow-hidden border-b border-ink/10 bg-paper-dim py-4">
      <div className="marquee-track flex w-max items-center gap-10">
        {[...items, ...items].map((name, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-slate"
          >
            {name}
            <span className="text-signal" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
