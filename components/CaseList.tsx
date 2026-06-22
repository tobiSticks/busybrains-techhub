"use client"

import { useMemo, useState } from "react"
import { MessageCircle } from "lucide-react"
import {
  ConsultationRequest,
  RequestStatus,
  STATUS_LABELS,
  STATUS_ORDER,
  SERVICE_CATEGORIES,
  INTERNAL_CATEGORY_LABELS,
} from "@/lib/services"
import { createClient } from "@/lib/supabase/client"
import CaseResponseForm from "@/components/CaseResponseForm"

const STATUS_COLORS: Record<RequestStatus, string> = {
  new: "bg-signal/20 text-ink border-signal/40",
  in_review: "bg-ink/10 text-ink border-ink/30",
  in_progress: "bg-ok/15 text-ok border-ok/40",
  completed: "bg-ink/5 text-slate border-ink/15",
}

function categoryName(id: string) {
  return SERVICE_CATEGORIES.find((c) => c.id === id)?.name || INTERNAL_CATEGORY_LABELS[id] || id
}

export default function CaseList({
  initialRequests,
}: {
  initialRequests: ConsultationRequest[]
}) {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState<RequestStatus | "all">("all")
  const [selected, setSelected] = useState<ConsultationRequest | null>(null)

  const filtered = useMemo(() => {
    if (filter === "all") return requests
    return requests.filter((r) => r.status === filter)
  }, [requests, filter])

  async function updateStatus(id: string, status: RequestStatus) {
    const supabase = createClient()
    const { error } = await supabase
      .from("consultation_requests")
      .update({ status })
      .eq("id", id)

    if (!error) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
    }
  }

  return (
    <div className="mt-8">
      {/* filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`focus-ring rounded-sm border px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
            filter === "all" ? "border-ink bg-ink text-paper" : "border-ink/15 text-slate"
          }`}
        >
          All ({requests.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`focus-ring rounded-sm border px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
              filter === s ? "border-ink bg-ink text-paper" : "border-ink/15 text-slate"
            }`}
          >
            {STATUS_LABELS[s]} ({requests.filter((r) => r.status === s).length})
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* list */}
        <div className="space-y-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10">
          {filtered.length === 0 && (
            <div className="bg-paper p-8 text-center text-sm text-slate">
              No cases in this view.
            </div>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`focus-ring block w-full bg-paper p-5 text-left transition-colors hover:bg-paper-dim ${
                selected?.id === r.id ? "bg-paper-dim" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs font-medium text-signal">
                  {r.source === "chat" && (
                    <MessageCircle className="h-3 w-3 shrink-0" aria-label="Started via live chat" />
                  )}
                  {r.reference_code}
                </span>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider ${STATUS_COLORS[r.status]}`}
                >
                  {STATUS_LABELS[r.status]}
                </span>
              </div>
              <div className="mt-1.5 font-medium text-ink">{r.subject}</div>
              <div className="mt-0.5 text-xs text-slate">
                {r.full_name} · {categoryName(r.service_category_id)}
              </div>
            </button>
          ))}
        </div>

        {/* detail */}
        <div className="rounded-sm border border-ink/10 bg-paper p-7">
          {!selected ? (
            <div className="flex h-full items-center justify-center text-sm text-slate">
              Select a case to view details.
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-[family-name:var(--font-mono)] text-xs font-medium text-signal">
                    {selected.reference_code}
                  </div>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">
                    {selected.subject}
                  </h2>
                </div>
                <span
                  className={`shrink-0 rounded-sm border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider ${STATUS_COLORS[selected.status]}`}
                >
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Client</dt>
                  <dd className="mt-1">{selected.full_name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${selected.email}`} className="underline">
                      {selected.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Phone</dt>
                  <dd className="mt-1">{selected.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Company</dt>
                  <dd className="mt-1">{selected.company_name || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Category</dt>
                  <dd className="mt-1">{categoryName(selected.service_category_id)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate">Type</dt>
                  <dd className="mt-1 capitalize">
                    {selected.request_type.replace("_", " ")}
                  </dd>
                </div>
                {selected.urgency !== "normal" && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate">Urgency</dt>
                    <dd className="mt-1 capitalize">{selected.urgency}</dd>
                  </div>
                )}
                {selected.preferred_approach && (
                  <div className="col-span-2">
                    <dt className="text-xs uppercase tracking-wider text-slate">Approach</dt>
                    <dd className="mt-1">{selected.preferred_approach}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <dt className="text-xs uppercase tracking-wider text-slate">Details</dt>
                <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">
                  {selected.details}
                </dd>
              </div>

              <div className="mt-8 border-t border-ink/10 pt-6">
                <div className="text-xs uppercase tracking-wider text-slate">Update status</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUS_ORDER.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`focus-ring rounded-sm border px-3.5 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
                        selected.status === s
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/15 text-ink/70 hover:border-ink/40"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <CaseResponseForm
                caseId={selected.id}
                clientEmail={selected.email}
                subject={selected.subject}
                referenceCode={selected.reference_code}
              />

              <div className="mt-6 font-[family-name:var(--font-mono)] text-xs text-slate">
                Opened {new Date(selected.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
