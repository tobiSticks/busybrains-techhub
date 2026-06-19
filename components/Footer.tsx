import Link from "next/link"
import { SERVICE_CATEGORIES } from "@/lib/services"

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-navy-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="font-[family-name:var(--font-display)] text-xl font-bold">
              BusyBrains Tech-Hub
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
              Corporate Services Limited. One consultancy across ten disciplines —
              every engagement opens a tracked case, reviewed end to end.
            </p>
          </div>

          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Services
            </div>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_CATEGORIES.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    className="focus-ring rounded text-sm text-paper/70 hover:text-paper"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Get in touch
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              <li>
                <Link href="/get-started" className="focus-ring rounded hover:text-paper">
                  Open a case
                </Link>
              </li>
              <li>
                <Link href="/contact" className="focus-ring rounded hover:text-paper">
                  Contact details
                </Link>
              </li>
              <li>
                <Link href="/login" className="focus-ring rounded hover:text-paper">
                  Staff login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BusyBrains Tech-Hub Corporate Services Limited.</span>
          <span className="font-[family-name:var(--font-mono)]">RC — registration on file</span>
        </div>
      </div>
    </footer>
  )
}
