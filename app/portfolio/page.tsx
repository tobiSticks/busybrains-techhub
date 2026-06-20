import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "Portfolio — BusyBrains Tech-Hub",
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Dynamic Execution
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Case Studies &amp; Projects
        </h1>
        <p className="mt-5 max-w-xl text-slate">
          Highlighting technology architecture deployments for private and
          public sector clients.
        </p>
      </ScrollReveal>

      <ScrollReveal
        delay={0.1}
        className="mt-14 rounded-sm border border-ink/10 bg-paper-dim p-10 text-center"
      >
        <p className="font-[family-name:var(--font-display)] font-bold">Coming soon</p>
        <p className="mt-2 text-sm text-slate">
          We&apos;re documenting our first case studies for publication here.
          In the meantime, open a case to discuss your project directly.
        </p>
      </ScrollReveal>
    </div>
  )
}
