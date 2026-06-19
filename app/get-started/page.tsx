import GetStartedForm from "@/components/GetStartedForm"
import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "Open a Case — BusyBrains Tech-Hub",
}

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <ScrollReveal>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-signal">
          Open a case
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Tell us what's going on
        </h1>
        <p className="mt-5 max-w-lg text-slate">
          Whether it's a problem that needs fixing or a project you want built,
          give us the details below. You'll get a reference code the moment you
          submit.
        </p>
      </ScrollReveal>

      <GetStartedForm initialCategory={category} />
    </div>
  )
}
