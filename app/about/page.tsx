import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "About — BusyBrains Tech-Hub",
}

const PARAGRAPHS = [
  `BusyBrains Tech-Hub Corporate Services Limited was built around a
  simple observation: businesses and individuals rarely have just one
  problem. The same client who needs a website built might also need
  their staff trained on cybersecurity, or help preparing a government
  tender. Most firms make you find a different vendor for each.`,
  `We don't make you do that. Every engagement — cybersecurity, AI & automation,
  software development, digital marketing, training, government
  contracts, solar energy, crypto & forex education, business
  consulting, and agriculture — runs through the same intake process,
  the same review discipline, and the same accountability.`,
  `That discipline shows up in the small details: every request you
  submit gets a reference code the moment it's received, the same way
  a security incident or a support ticket would. You're never
  wondering whether your message got through — you have a record of
  it, and so do we.`,
  `Our cybersecurity and IT teams hold relevant industry certifications,
  and our government contract specialists understand procurement
  processes from the inside. Whatever the discipline, the same
  standard applies: take the case seriously, route it to people who
  actually know the work, and follow it through to close.`,
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          About
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          One consultancy, built for range
        </h1>
      </ScrollReveal>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/80">
        {PARAGRAPHS.map((text, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <p>{text}</p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
