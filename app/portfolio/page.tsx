import { ScrollReveal } from "@/components/ScrollReveal"
import { CaseStudyCard } from "@/components/CaseStudyCard"

export const metadata = {
  title: "Portfolio — BusyBrains Tech-Hub",
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
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

      <ScrollReveal delay={0.1} className="mt-14">
        <CaseStudyCard />
      </ScrollReveal>
    </div>
  )
}
