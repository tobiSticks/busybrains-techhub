"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { TopUtilityBar } from "@/components/TopUtilityBar"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/ai-solutions", label: "AI Solutions" },
  { href: "/cybersecurity", label: "Cybersecurity" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/news", label: "News" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <TopUtilityBar />
      <div className="border-b border-paper/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 focus-ring rounded">
            <Image src="/icon.png" alt="BusyBrains Tech-Hub" width={32} height={32} />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-paper">
              BusyBrains
            </span>
            <span className="hidden font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-paper/50 sm:inline">
              Tech-Hub
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded text-sm font-medium text-paper/75 transition-colors hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="focus-ring rounded text-sm font-medium text-signal transition-colors hover:text-signal-soft"
            >
              Admin Portal
            </Link>
            <Link
              href="/get-started"
              className="focus-ring rounded-sm bg-signal px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-navy-deep transition-colors hover:bg-signal-soft"
            >
              Get Free Quote
            </Link>
          </nav>

          <button
            className="focus-ring rounded p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-6 bg-paper" />
            <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
            <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
          </button>
        </div>

        {open && (
          <nav className="border-t border-paper/10 bg-navy px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded text-sm font-medium text-paper"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="focus-ring rounded text-sm font-medium text-signal"
              >
                Admin Portal
              </Link>
              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm bg-signal px-4 py-3 text-center font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-navy-deep"
              >
                Get Free Quote
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
