"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { href: "/dashboard", label: "Cases" },
  { href: "/dashboard/chat", label: "Live Chat" },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl gap-1 px-5">
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`focus-ring -mb-px border-b-2 px-3 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
                active ? "border-ink text-ink" : "border-transparent text-slate hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
