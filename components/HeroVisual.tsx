"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const TERMINAL_LINES = [
  "$ scanning network for vulnerabilities... clear",
  "$ deploying staging build... done",
  "$ case REQ-CYB-0042 routed to specialist",
  "$ payment confirmed — ₦450,000 received",
  "$ tender document REQ-GOV-0007 submitted",
  "$ solar install REQ-SOL-0033 scheduled",
]

export function HeroLogoWatermark() {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0.08, 0.08] : [0.14, 0])
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 80])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ opacity, y }}
        className="absolute -right-24 -top-24 h-[520px] w-[520px] sm:h-[640px] sm:w-[640px]"
      >
        <Image src="/icon.png" alt="" fill className="object-contain" priority />
      </motion.div>
    </div>
  )
}

export function HeroTerminal() {
  const prefersReducedMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const totalDuration = 1200 + TERMINAL_LINES.length * 500 + 2500
    const id = setInterval(() => setCycle((c) => c + 1), totalDuration)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-md overflow-hidden rounded-sm border border-paper/15 bg-navy-deep/60 shadow-2xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
        <span className="ml-2 font-[family-name:var(--font-mono)] text-[11px] text-paper/40">
          case-pipeline
        </span>
      </div>
      <div className="min-h-[168px] space-y-2 px-4 py-4 font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-paper/70">
        <AnimatePresence mode="wait">
          <motion.div key={cycle} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {TERMINAL_LINES.map((line, i) =>
              prefersReducedMotion ? (
                <div key={line}>
                  <span className="text-signal-soft">{line.slice(0, 2)}</span>
                  {line.slice(2)}
                </div>
              ) : (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.5 }}
                >
                  <span className="text-signal-soft">{line.slice(0, 2)}</span>
                  {line.slice(2)}
                </motion.div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
