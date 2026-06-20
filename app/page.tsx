import Link from "next/link"
import { SERVICE_CATEGORIES } from "@/lib/services"
import { HeroLogoWatermark, HeroTerminal } from "@/components/HeroVisual"
import { ScrollReveal } from "@/components/ScrollReveal"
import { ServiceMarquee } from "@/components/ServiceMarquee"
import Testimonials from "@/components/Testimonials"

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-paper/10 bg-gradient-to-b from-navy-deep to-navy">
        <HeroLogoWatermark />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
              Busybrains Tech-Hub Corporate Services Ltd
            </div>

            <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-6xl">
              Ten disciplines.
              <br />
              One case file.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
              Whether your account was breached, your business needs a website, or
              a tender is due Friday — every request opens a tracked case, reviewed
              by our team from intake to close.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/get-started"
                className="focus-ring rounded-sm bg-signal px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-navy-deep transition-colors hover:bg-signal-soft"
              >
                Open a case
              </Link>
              <Link
                href="/services"
                className="focus-ring rounded-sm border border-paper/25 px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:border-paper"
              >
                See all services
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-end lg:block">
            <HeroTerminal />
          </div>
        </div>

        <div className="relative border-t border-paper/10 bg-navy-deep/60">
          <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-5 py-3 font-[family-name:var(--font-mono)] text-[11px] text-paper/50">
            <span className="shrink-0 text-signal">LIVE CASE FORMAT</span>
            {["REQ-CYB-0042", "REQ-SIT-0118", "REQ-GOV-0007", "REQ-SOL-0033", "REQ-AIA-0091"].map(
              (code) => (
                <span key={code} className="shrink-0 rounded-sm border border-paper/10 px-2.5 py-1">
                  {code}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <ServiceMarquee />

      {/* SERVICE GRID */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
              What we handle
            </h2>
            <Link
              href="/services"
              className="focus-ring hidden shrink-0 rounded font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-slate hover:text-ink sm:block"
            >
              Full list →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={(i % 3) * 0.06}>
              <Link
                href={`/services#${cat.id}`}
                className="focus-ring group flex h-full flex-col justify-between bg-paper p-6 transition-colors hover:bg-ink hover:text-paper"
              >
                <div>
                  <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-signal">
                    {cat.prefix}
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold leading-snug">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate group-hover:text-paper/60">
                    {cat.blurb}
                  </p>
                </div>
                <div className="mt-6 font-[family-name:var(--font-mono)] text-xs text-slate group-hover:text-signal">
                  {cat.items.length} services →
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-ink/10 bg-paper-dim">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <ScrollReveal>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
              How a case moves
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-4">
            {[
              {
                stage: "New",
                desc: "You submit the form. A reference code is issued immediately and a copy lands in your inbox.",
              },
              {
                stage: "In review",
                desc: "Our team reads the details and routes it to the right specialists.",
              },
              {
                stage: "In progress",
                desc: "Work begins — we'll reach you directly by phone or email for anything we need.",
              },
              {
                stage: "Completed",
                desc: "Case closed. You'll have a record of exactly what was done and when.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.stage} delay={i * 0.08} className="bg-paper p-6">
                <div className="font-[family-name:var(--font-mono)] text-xs text-signal">
                  0{i + 1}
                </div>
                <div className="mt-2 font-[family-name:var(--font-display)] font-bold">
                  {step.stage}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate">{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <ScrollReveal className="mx-auto flex max-w-md flex-col items-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            Have a problem or a project?
          </h2>
          <p className="mt-4 text-slate">
            Tell us what happened or what you need built. We&apos;ll open a case and get
            back to you.
          </p>
          <Link
            href="/get-started"
            className="focus-ring mt-8 inline-block rounded-sm bg-ink px-7 py-4 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
          >
            Open a case
          </Link>
        </ScrollReveal>
      </section>
    </>
  )
}
