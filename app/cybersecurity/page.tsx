import Link from "next/link"
import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "Cybersecurity — BusyBrains Tech-Hub",
}

const SERVICES = [
  {
    title: "Vulnerabilities Assessments",
    desc: "We perform manual and automated penetration-testing audits of your client APIs, web routing, and databases, identifying weaknesses before attackers can exploit them.",
    items: [
      "OWASP Top 10 web scan audits",
      "Closed-source system query checks",
      "Complete remediation reporting sheets",
    ],
  },
  {
    title: "Security Awareness Drills",
    desc: "We train your team using customized local phishing exercises, interactive quizzes, and information-tracking modules.",
    items: [
      "Custom localized phishing-style templates",
      "Direct pass/fail metrics for staff groups",
      "Ongoing compliance standards alignment",
    ],
  },
]

export default function CybersecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Defensive Protocols
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Information Security &amp; Audits
        </h1>
        <p className="mt-5 max-w-xl text-slate">
          Protecting your enterprise databases, routing systems, and software
          endpoints against active threats.
        </p>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
        {SERVICES.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.08} className="bg-paper p-7 sm:p-9">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight uppercase">
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{s.desc}</p>
            <ul className="mt-4 space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex items-baseline gap-2.5 text-sm text-ink/80">
                  <span className="font-[family-name:var(--font-mono)] text-signal">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.2} className="mt-10">
        <Link
          href="/get-started?category=cybersecurity"
          className="focus-ring inline-block rounded-sm bg-ink px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
        >
          Request a security audit →
        </Link>
      </ScrollReveal>
    </div>
  )
}
