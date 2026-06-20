"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const FAQS = [
  {
    q: "Who is BusyBrains Tech-Hub Corporate Services Limited?",
    a: "A registered Nigerian technology consultancy (CAC RC 9584510) based in Abuja, offering cybersecurity, AI & automation, software development, training, and several other disciplines under one intake process.",
  },
  {
    q: "Are your platforms compliant with Nigerian data protection laws?",
    a: "Data protection alignment is part of our ongoing operating standard. If you need specifics for a compliance review, open a case via Contact and we'll address it directly with documentation.",
  },
  {
    q: "Where is BusyBrains Tech-Hub located?",
    a: "Our registered headquarters is in Abuja, FCT, Nigeria. We work with clients across Nigeria regardless of location.",
  },
  {
    q: "How does the customer support AI bot work?",
    a: "Our WhatsApp and web channels are monitored by our team. Any AI-assisted responses are there to triage and route your message faster — a human reviews every case.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={item.q} className="overflow-hidden rounded-sm border border-ink/10 bg-paper">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-[family-name:var(--font-display)] text-sm font-bold">
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-slate"
                aria-hidden
              >
                ▾
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
