import Link from "next/link"
import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "AI Solutions — BusyBrains Tech-Hub",
}

const CAPABILITIES = [
  "Automated lead context mapping with zero API leaks",
  "Fast, structured handling of service specifications",
  "Seamless WhatsApp notification triggers",
]

export default function AiSolutionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Cognitive Workflows
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Enterprise AI &amp; Automation
        </h1>
        <p className="mt-5 max-w-xl text-slate">
          Intelligent machine learning setups driving extreme operational
          efficiency.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="mt-14 rounded-sm border border-ink/10 bg-paper-dim p-7 sm:p-9">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
          Advanced Capabilities
        </div>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Conversational Chatbot Integrations
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">
          Transform how you converse with visitors, capture customer briefs,
          and pre-qualify leads with carefully-scoped chatbots. Mapped with
          strict prompt policies, our chatbots assist users, answer service
          questions, and hand off to a human the moment a conversation needs
          one.
        </p>
        <ul className="mt-5 space-y-2.5">
          {CAPABILITIES.map((item) => (
            <li key={item} className="flex items-baseline gap-2.5 text-sm text-ink/80">
              <span className="font-[family-name:var(--font-mono)] text-signal">·</span>
              {item}
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal delay={0.18} className="mt-10">
        <Link
          href="/get-started?category=ai-automation"
          className="focus-ring inline-block rounded-sm bg-ink px-6 py-3.5 font-[family-name:var(--font-mono)] text-sm font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
        >
          Discuss an AI project →
        </Link>
      </ScrollReveal>
    </div>
  )
}
