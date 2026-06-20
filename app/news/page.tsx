import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "News — BusyBrains Tech-Hub",
}

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          BusyBrains Chronicle
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Resource &amp; Tech News
        </h1>
        <p className="mt-5 max-w-xl text-slate">
          Expert articles and security advice from our development desk.
        </p>
      </ScrollReveal>

      <ScrollReveal
        delay={0.1}
        className="mt-14 rounded-sm border border-ink/10 bg-paper-dim p-10 text-center"
      >
        <p className="font-[family-name:var(--font-display)] font-bold">Coming soon</p>
        <p className="mt-2 text-sm text-slate">
          We&apos;re preparing our first articles. Check back shortly, or
          subscribe in the footer to be notified.
        </p>
      </ScrollReveal>
    </div>
  )
}
