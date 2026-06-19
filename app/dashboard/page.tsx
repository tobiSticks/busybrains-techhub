import { createClient } from "@/lib/supabase/server"
import CaseList from "@/components/CaseList"
import { ConsultationRequest } from "@/lib/services"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Cases
      </h1>
      <CaseList initialRequests={(requests as ConsultationRequest[]) || []} />
    </div>
  )
}
