"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded">
          <Image src="/icon.png" alt="BusyBrains Tech-Hub" width={32} height={32} />
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            BusyBrains
          </span>
          <span className="hidden font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-slate sm:inline">
            Tech-Hub
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/get-started"
            className="focus-ring rounded-sm bg-ink px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink"
          >
            Open a case
          </Link>
        </nav>

        <button
          className="focus-ring rounded p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded text-sm font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/get-started"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-sm bg-ink px-4 py-3 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper"
            >
              Open a case
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
