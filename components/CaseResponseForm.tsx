"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type CaseResponse = {
  id: string
  message: string
  created_at: string
}

export default function CaseResponseForm({
  caseId,
  clientEmail,
  subject,
  referenceCode,
}: {
  caseId: string
  clientEmail: string
  subject: string
  referenceCode: string
}) {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [history, setHistory] = useState<CaseResponse[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setMessage("")
    setStatus("idle")
    setErrorMsg(null)
    loadHistory()
  }, [caseId])

  async function loadHistory() {
    const supabase = createClient()
    const { data } = await supabase
      .from("case_responses")
      .select("id, message, created_at")
      .eq("consultation_request_id", caseId)
      .order("created_at", { ascending: false })
    setHistory(data || [])
  }

  async function handleSend() {
    if (message.trim().length < 3) return
    setStatus("sending")
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/consultations/${caseId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not send your response.")
      setStatus("sent")
      setMessage("")
      loadHistory()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not send your response.")
      setStatus("error")
    }
  }

  return (
    <div className="mt-8 border-t border-ink/10 pt-6">
      <div className="text-xs uppercase tracking-wider text-slate">Respond to client</div>

      <div className="mt-3 overflow-hidden rounded-sm border border-ink/15">
        <div className="space-y-1.5 border-b border-ink/10 bg-paper-dim px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-slate">
          <div>
            <span className="text-slate/70">To:</span>{" "}
            <span className="text-ink">{clientEmail}</span>
          </div>
          <div>
            <span className="text-slate/70">Subject:</span>{" "}
            <span className="text-ink">
              Re: {subject} — {referenceCode}
            </span>
          </div>
        </div>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply to the client here…"
          className="focus-ring w-full resize-none bg-paper px-4 py-3 text-sm placeholder:text-slate/60"
        />
        <div className="flex items-center justify-between gap-3 border-t border-ink/10 bg-paper-dim px-4 py-2.5">
          <span className="text-[11px] text-slate">
            Sent as a branded email to the client&apos;s inbox.
          </span>
          <button
            type="button"
            onClick={handleSend}
            disabled={status === "sending" || message.trim().length < 3}
            className="focus-ring shrink-0 rounded-sm bg-ink px-5 py-2 font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-wider text-paper transition-colors hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
      </div>

      {status === "sent" && (
        <p className="mt-2 text-xs text-ok">Response sent to {clientEmail}.</p>
      )}
      {status === "error" && errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}

      {history.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate">Sent responses</div>
          {history.map((r) => (
            <div key={r.id} className="rounded-sm border border-ink/10 bg-paper p-4">
              <div className="font-[family-name:var(--font-mono)] text-[11px] text-slate">
                {new Date(r.created_at).toLocaleString()}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">
                {r.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
