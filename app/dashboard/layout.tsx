import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignOutButton from "@/components/SignOutButton"
import DashboardNav from "@/components/DashboardNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-ink/10 bg-paper-dim">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-signal">
              Dashboard
            </div>
            <div className="text-sm text-slate">{user.email}</div>
          </div>
          <SignOutButton />
        </div>
      </div>
      <DashboardNav />
      {children}
    </div>
  )
}
