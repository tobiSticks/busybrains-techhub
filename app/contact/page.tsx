import { ScrollReveal } from "@/components/ScrollReveal"
import { QuoteForm } from "@/components/QuoteForm"
import { MessageForm } from "@/components/MessageForm"

export const metadata = {
  title: "Contact — BusyBrains Tech-Hub",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Connect With Us
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Engage Deep Advisory
        </h1>
        <p className="mt-5 text-slate">
          Request detailed technical cost quotes from our Abuja advisors, or
          leave a general message below.
        </p>
      </ScrollReveal>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ScrollReveal delay={0.1}>
          <QuoteForm />
        </ScrollReveal>

        <div className="space-y-8">
          <ScrollReveal delay={0.16}>
            <MessageForm />
          </ScrollReveal>

          <ScrollReveal delay={0.22} className="rounded-sm border border-paper/10 bg-navy-deep p-7 text-paper">
            <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-signal">
              Direct Headquarter Channels
            </div>
            <p className="mt-2 text-sm text-paper/70">
              Write or call us directly. Our Abuja administrative officers
              respond as soon as they can.
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-paper/50">Address</dt>
                <dd>Abuja, Federal Capital Territory, Nigeria</dd>
              </div>
              <div>
                <dt className="text-paper/50">Phone</dt>
                <dd>
                  <a href="tel:+2348161164007" className="focus-ring rounded hover:text-signal">
                    +234 816 116 4007
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/50">Email</dt>
                <dd>
                  <a
                    href="mailto:info@busybrainstech-hub.com.ng"
                    className="focus-ring rounded hover:text-signal"
                  >
                    info@busybrainstech-hub.com.ng
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/50">Telegram</dt>
                <dd>
                  <a
                    href="https://t.me/busybrainstech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring rounded hover:text-signal"
                  >
                    @busybrainstech
                  </a>
                </dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
