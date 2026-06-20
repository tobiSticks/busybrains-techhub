import Link from "next/link"
import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "Mentorship — BusyBrains Tech-Hub",
}

const PROGRAMS = [
  {
    title: "Full-Stack Bootcamp",
    desc: "React, Vite, Node/Express backend architectures, relational databases, and static deployments.",
    duration: "12 Weeks",
  },
  {
    title: "Ethical Pen-Testing",
    desc: "Network vulnerability audits, Kali system configuration, API scanning, and safety guidelines.",
    duration: "8 Weeks",
  },
  {
    title: "Data Analytics",
    desc: "Advanced Excel workflows, custom visual charts using PowerBI/Tableau, and structured SQL queries.",
    duration: "6 Weeks",
  },
]

export default function MentorshipPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Talent Accelerator
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Mentorship &amp; Bootcamps
        </h1>
        <p className="mt-5 max-w-xl text-slate">
          Accelerating youths, corporate trainees, and startup innovators in
          Abuja, Nigeria.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-14 rounded-sm border border-ink/10 bg-paper-dim p-7 sm:p-9">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div key={p.title} className="rounded-sm border border-ink/10 bg-paper p-5">
              <div className="font-[family-name:var(--font-display)] text-sm font-bold uppercase">
                {p.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate">{p.desc}</p>
              <div className="mt-4 font-[family-name:var(--font-mono)] text-xs text-ok">
                Duration: {p.duration}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate">
            Interested in joining our next physical tech cohort in Abuja,
            Nigeria? Class reserves are limited.
          </p>
          <Link
            href="/get-started?category=training-consultancy"
            className="focus-ring shrink-0 rounded-sm bg-ink px-6 py-3 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
          >
            Apply for next cohort →
          </Link>
        </div>
      </ScrollReveal>
    </div>
  )
}
