import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "About — BusyBrains Tech-Hub",
}

const PILLARS = [
  {
    n: "1",
    title: "Secure Deployments",
    desc: "Careful attention to information security, system vulnerability mitigation, and data-protection-conscious practices.",
  },
  {
    n: "2",
    title: "High Tech Innovation",
    desc: "Leveraging modern LLMs, advanced React stacks, and cognitive system automations to build things that last.",
  },
  {
    n: "3",
    title: "Youth Acceleration",
    desc: "Immersive code mentorships, ethical cybersecurity auditing groups, and digital skills mapping for the next generation.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Corporate Profile
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          About BusyBrains
        </h1>
        <p className="mt-3 font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-slate">
          Secure. Innovate. Grow.
        </p>
      </ScrollReveal>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/80">
        <ScrollReveal>
          <p>
            <strong>BusyBrains Tech-Hub Corporate Services Limited</strong> (RC
            Number: <strong>9584510</strong>) is a registered technology
            development and secure-deployment consultancy based out of
            Nigeria&apos;s capital city, Abuja.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.06}>
          <p>
            We bridge the gap between advanced technology architectures and
            robust threat protection. In an active, high-traffic digital
            economy, we equip corporate players, public-sector operations, and
            individuals with the computational assets and training to ward off
            technical threats safely.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <p className="border-l-2 border-signal pl-5 italic text-ink/70">
            &ldquo;Our focus is not simply producing lines of code, but
            sculpting secure, scale-ready corporate frameworks that
            endure.&rdquo;
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.15} className="mt-14 rounded-sm border border-ink/10 bg-paper-dim p-7 sm:p-9">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
          Registration Specifications
        </div>
        <div className="mt-1 text-sm font-bold">Active CAC record registered in Nigeria</div>
        <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate">Company</dt>
            <dd className="font-medium">BusyBrains Tech-Hub Ltd</dd>
          </div>
          <div>
            <dt className="text-slate">CAC Number</dt>
            <dd className="font-medium">RC 9584510</dd>
          </div>
          <div>
            <dt className="text-slate">Corporate Form</dt>
            <dd className="font-medium">Private Company Limited by Shares</dd>
          </div>
          <div>
            <dt className="text-slate">Status</dt>
            <dd className="font-medium text-ok">Active</dd>
          </div>
        </dl>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-3">
        {PILLARS.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08} className="bg-paper p-6">
            <div className="font-[family-name:var(--font-mono)] text-xs text-signal">{p.n}</div>
            <div className="mt-2 font-[family-name:var(--font-display)] font-bold">{p.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate">{p.desc}</p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
