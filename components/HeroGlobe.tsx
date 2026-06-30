"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Bot, Code2, GraduationCap, Landmark, Megaphone, Shield } from "lucide-react"

const ORBIT_BADGES = [
  { label: "Cybersecurity", icon: Shield, top: "6%", left: "2%" },
  { label: "AI & Automation", icon: Bot, top: "0%", left: "62%" },
  { label: "Software & IT", icon: Code2, top: "36%", left: "78%" },
  { label: "Gov Contracts", icon: Landmark, top: "70%", left: "70%" },
  { label: "Training", icon: GraduationCap, top: "78%", left: "8%" },
  { label: "Marketing", icon: Megaphone, top: "38%", left: "-6%" },
] as const

// Longitude rings of a wireframe sphere — each is a static great-circle
// rotated about the Y axis; the parent spins continuously so they sweep
// past the viewer like a real rotating globe (pure CSS 3D, no asset/lib).
const MERIDIANS = [0, 30, 60, 90, 120, 150]
const LATITUDES = [
  { scaleY: 0.92, top: "8%" },
  { scaleY: 0.6, top: "32%" },
  { scaleY: 0.6, top: "62%" },
  { scaleY: 0.92, top: "84%" },
]

export function HeroGlobe() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]">
      {/* core glow */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-signal-soft)_0%,var(--color-signal)_18%,var(--color-navy)_62%,var(--color-navy-deep)_100%)] shadow-[0_0_90px_-10px_var(--color-signal)] opacity-90" />

      {/* static latitude rings */}
      <div className="pointer-events-none absolute inset-[12%] overflow-hidden rounded-full">
        {LATITUDES.map((lat, i) => (
          <div
            key={i}
            className="absolute left-0 w-full rounded-full border border-paper/25"
            style={{ top: lat.top, height: "2px", transform: `scaleY(${lat.scaleY})` }}
          />
        ))}
      </div>

      {/* spinning longitude rings (real CSS 3D — perspective on wrapper) */}
      <div className="absolute inset-[12%] rounded-full" style={{ perspective: 700 }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={prefersReducedMotion ? undefined : { rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
        >
          {MERIDIANS.map((deg) => (
            <div
              key={deg}
              className="absolute inset-0 rounded-full border border-paper/30"
              style={{ transform: `rotateY(${deg}deg)`, transformStyle: "preserve-3d" }}
            />
          ))}
        </motion.div>
      </div>

      {/* orbiting service badges */}
      {ORBIT_BADGES.map((b, i) => (
        <motion.div
          key={b.label}
          className="absolute z-10"
          style={{ top: b.top, left: b.left }}
          animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 + (i % 3), ease: "easeInOut", delay: i * 0.3 }}
        >
          <div className="flex items-center gap-2 rounded-sm border border-paper/15 bg-navy-deep/80 px-3 py-2 shadow-lg backdrop-blur-sm">
            <b.icon className="h-3.5 w-3.5 shrink-0 text-signal" aria-hidden />
            <span className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-paper/85">
              {b.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
