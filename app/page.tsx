import Link from "next/link"
import { SERVICE_CATEGORIES } from "@/lib/services"
import { HeroLogoWatermark } from "@/components/HeroVisual"
import { HeroGlobe } from "@/components/HeroGlobe"
import { SERVICE_ICONS } from "@/lib/serviceIcons"
import { ScrollReveal } from "@/components/ScrollReveal"
import { ServiceMarquee } from "@/components/ServiceMarquee"
import { TrustBadges } from "@/components/TrustBadges"
import { StatsBar } from "@/components/StatsBar"
import { FaqAccordion } from "@/components/FaqAccordion"
import { TestimonialForm } from "@/components/TestimonialForm"
import Testimonials from "@/components/Testimonials"

const PILLAR_CATEGORIES = SERVICE_CATEGORIES.filter((c) => c.pillar)
const NETWORK_CATEGORIES = SERVICE_CATEGORIES.filter((c) => !c.pillar)

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-paper/10 bg-gradient-to-b from-navy-deep to-navy">
        <HeroLogoWatermark />

        <div className="relative grid gap-12 pb-20 pl-[60px] pr-5 pt-16 sm:pl-[72px] sm:pr-8 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pl-[88px] lg:pr-12">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
              Busybrains Tech-Hub Corporate Services Ltd
            </div>

            <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-6xl">
              Ten disciplines.
              <br />
              One case file.
            </h1>

            <p className="mt-5 max-w-xl text-base font-medium text-paper/90">
              Built on two registered pillars — cybersecurity and government
              contracts. Eight more disciplines run through the same case
              system.
            </p>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">
              A case is a tracked request, not just a form submission: a
              reference code on submission, a named reviewer, and a status you
              can follow from intake to close. Mark it urgent and it&apos;s
              handled first.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/get-started"
                className="focus-ring rounded-sm bg-signal px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-navy-deep transition-colors hover:bg-signal-soft"
              >
                Open a case
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-center lg:flex lg:items-center lg:justify-center">
            <HeroGlobe />
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

      <TrustBadges />

      {/* SERVICE GRID */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <ScrollReveal className="text-center">
          <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
            Our Core Pillars
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            Cybersecurity & Government Contracts
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate">
            What we&apos;re registered and built around. Everything else runs
            through the same case system as part of the broader BusyBrains
            Hub network.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {PILLAR_CATEGORIES.map((cat, i) => {
            const Icon = SERVICE_ICONS[cat.id]
            return (
              <ScrollReveal key={cat.id} delay={i * 0.06}>
                <Link
                  href={`/services#${cat.id}`}
                  className="focus-ring group flex h-full flex-col justify-between bg-paper p-7 transition-colors hover:bg-ink hover:text-paper sm:p-9"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-ink/5 text-ink group-hover:bg-paper/10 group-hover:text-paper">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="mt-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-signal">
                      {cat.prefix} · Core Pillar
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold leading-snug">
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
            )
          })}
        </div>

        <ScrollReveal delay={0.1}>
          <h3 className="mt-16 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            Also through the BusyBrains Hub network
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate">
            Eight more disciplines, tracked the same way — same intake, same
            reference codes.
          </p>
        </ScrollReveal>

        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {NETWORK_CATEGORIES.map((cat, i) => {
            const Icon = SERVICE_ICONS[cat.id]
            return (
            <ScrollReveal key={cat.id} delay={(i % 4) * 0.05}>
              <Link
                href={`/services#${cat.id}`}
                className="focus-ring group flex h-full flex-col justify-between bg-paper-dim p-5 transition-colors hover:bg-ink hover:text-paper"
              >
                <div>
                  <Icon className="h-5 w-5 text-ink/50 group-hover:text-signal" aria-hidden />
                  <div className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-slate group-hover:text-signal">
                    {cat.prefix}
                  </div>
                  <h4 className="mt-1.5 font-[family-name:var(--font-display)] text-sm font-bold leading-snug">
                    {cat.name}
                  </h4>
                </div>
                <div className="mt-4 font-[family-name:var(--font-mono)] text-[11px] text-slate group-hover:text-signal">
                  {cat.items.length} services →
                </div>
              </Link>
            </ScrollReveal>
            )
          })}
        </div>
      </section>

      <StatsBar />

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

      {/* TESTIMONIAL SUBMISSION */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <ScrollReveal className="text-center">
          <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
            Client Testimonials
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            What Tech Leaders Say
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1} className="mt-10">
          <TestimonialForm />
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/10 bg-paper-dim py-20">
        <div className="px-5">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Got Questions?
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently Inquired Details
            </h2>
          </ScrollReveal>
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </div>
      </section>

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
