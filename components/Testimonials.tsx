"use client"

import { ScrollReveal } from "@/components/ScrollReveal"

// NOTE: placeholder sample reviews — swap for real client testimonials before public launch.
const REVIEWS = [
  {
    name: "Chidinma Okafor",
    role: "Operations Lead, Lagos",
    quote:
      "Our staff went through the cybersecurity training and the difference showed within weeks — fewer phishing clicks, faster reporting. The case reference made it easy to track progress the whole way through.",
  },
  {
    name: "Tunde Adebayo",
    role: "Founder, Ibadan",
    quote:
      "Needed a website and a tender document prepared in the same month. Both ran through the same intake process and neither felt rushed. That's rare.",
  },
  {
    name: "Amaka Eze",
    role: "Admin Manager, Abuja",
    quote:
      "Reported a security incident on a Sunday and had a reference code within minutes. Someone from the team called Monday morning already briefed on the details.",
  },
  {
    name: "Ibrahim Musa",
    role: "Site Supervisor, Kano",
    quote:
      "Solar installation was done on schedule and the team explained the maintenance plan clearly before they left. No back and forth needed.",
  },
  {
    name: "Ngozi Umeh",
    role: "HR Consultant, Port Harcourt",
    quote:
      "Used them for a business process review and the AI automation team for our reporting workflow. Different disciplines, same point of contact — that part actually works.",
  },
  {
    name: "Femi Olawale",
    role: "Agro Cooperative Lead, Oyo State",
    quote:
      "They handled the agritech consultancy and the paperwork side together. Straightforward people to work with, and they followed up after the case closed.",
  },
]

export default function Testimonials() {
  return (
    <section className="border-t border-ink/10 bg-paper-dim">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            What clients say
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <ScrollReveal key={r.name} delay={(i % 3) * 0.08} className="bg-paper p-6">
              <div className="flex gap-0.5 text-signal" aria-hidden>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <svg key={starIdx} viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">&ldquo;{r.quote}&rdquo;</p>
              <div className="mt-5 font-[family-name:var(--font-display)] text-sm font-bold">
                {r.name}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate">
                {r.role}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
