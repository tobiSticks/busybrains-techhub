import Image from "next/image"
import Link from "next/link"
import { NewsletterForm } from "@/components/NewsletterForm"

const DELIVERABLES = [
  { label: "Vulnerabilities assessments", href: "/cybersecurity" },
  { label: "System hardening audits", href: "/cybersecurity" },
  { label: "React / Mobile Web systems", href: "/services" },
  { label: "Conversational chatbots", href: "/ai-solutions" },
  { label: "Ethical tech mentorship", href: "/mentorship" },
]

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-navy-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="" width={28} height={28} />
              <div className="font-[family-name:var(--font-display)] text-xl font-bold leading-none">
                BUSYBRAINS
                <span className="block font-[family-name:var(--font-mono)] text-xs font-normal uppercase tracking-widest text-signal">
                  Tech-Hub
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              BUSYBRAINS TECH-HUB CORPORATE SERVICES LIMITED (RC 9584510) is
              Nigeria&apos;s active portal for securing, innovating, and
              accelerating business assets.
            </p>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-paper/40">
              Headquarters: Abuja, FCT, Nigeria.
            </p>
          </div>

          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Offered Deliverables
            </div>
            <ul className="mt-4 space-y-2.5">
              {DELIVERABLES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="focus-ring rounded text-sm text-paper/70 hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Newsletter Circulations
            </div>
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              Subscribe to receive monthly reports of technical risk
              strategies and platform developments.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BUSYBRAINS TECH-HUB CORPORATE SERVICES LIMITED. All Rights Reserved.</span>
          <span className="flex items-center gap-3 font-[family-name:var(--font-mono)]">
            <span>
              CAC STATUS: <span className="text-ok">Active</span>
            </span>
            <span>RC RC-9584510</span>
            <Link href="/login" className="focus-ring rounded text-signal hover:text-signal-soft">
              Admin Portal Login
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
