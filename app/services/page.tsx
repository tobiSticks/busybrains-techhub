import Link from "next/link"
import { SERVICE_CATEGORIES } from "@/lib/services"

export const metadata = {
  title: "Services — BusyBrains Tech-Hub",
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
        Full service index
      </div>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
        Every case starts here
      </h1>
      <p className="mt-5 max-w-xl text-slate">
        Pick the category closest to what's going on. You'll confirm specifics
        on the next step, and the right specialists pick it up from there.
      </p>

      <div className="mt-16 space-y-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10">
        {SERVICE_CATEGORIES.map((cat) => (
          <div key={cat.id} id={cat.id} className="scroll-mt-24 bg-paper p-7 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-signal">
                  {cat.prefix}
                </div>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                  {cat.name}
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate">{cat.blurb}</p>
              </div>

              <Link
                href={`/get-started?category=${cat.id}`}
                className="focus-ring shrink-0 rounded-sm border border-ink/20 px-5 py-2.5 text-center font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Open a {cat.prefix} case →
              </Link>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-2.5 text-sm text-ink/80"
                >
                  <span className="font-[family-name:var(--font-mono)] text-signal">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
