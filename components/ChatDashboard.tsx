"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChatConversation, ChatConversationStatus, ChatMessage, ChatVisitor } from "@/lib/chat"
import { useResolvedAttachments } from "@/lib/useResolvedAttachments"
import ChatMessageBubble from "@/components/ChatMessageBubble"
import AttachmentUpload from "@/components/AttachmentUpload"

const STATUS_COLORS: Record<ChatConversationStatus, string> = {
  queued: "bg-signal/20 text-ink border-signal/40",
  active: "bg-ok/15 text-ok border-ok/40",
  closed: "bg-ink/5 text-slate border-ink/15",
}

const STATUS_LABELS: Record<ChatConversationStatus, string> = {
  queued: "Queued",
  active: "Active",
  closed: "Closed",
}

const FILTERS: { key: ChatConversationStatus; label: string }[] = [
  { key: "queued", label: "Queue" },
  { key: "active", label: "Active" },
  { key: "closed", label: "Closed" },
]

export default function ChatDashboard({
  initialConversations,
  currentUserId,
}: {
  initialConversations: ChatConversation[]
  currentUserId: string
}) {
  const [supabase] = useState(() => createClient())
  const [conversations, setConversations] = useState(initialConversations)
  const [filter, setFilter] = useState<ChatConversationStatus>("queued")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [visitor, setVisitor] = useState<ChatVisitor | null>(null)
  const [visitorTyping, setVisitorTyping] = useState(false)
  const [onlineAgents, setOnlineAgents] = useState(1)
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingSentRef = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)

  const attachmentUrls = useResolvedAttachments(supabase, messages)

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  )

  const filtered = useMemo(() => conversations.filter((c) => c.status === filter), [conversations, filter])

  // Keep the conversation list live for every agent.
  useEffect(() => {
    const channel = supabase
      .channel("chat-conversations-list")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_conversations" }, (payload) => {
        const next = payload.new as ChatConversation
        setConversations((prev) => (prev.some((c) => c.id === next.id) ? prev : [next, ...prev]))
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_conversations" }, (payload) => {
        const next = payload.new as ChatConversation
        setConversations((prev) => prev.map((c) => (c.id === next.id ? next : c)))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Agents-online presence.
  useEffect(() => {
    const channel = supabase.channel("agents-presence", {
      config: { presence: { key: currentUserId } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineAgents(Object.keys(channel.presenceState()).length)
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel.track({ online_at: new Date().toISOString() })
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentUserId])

  // Load thread + visitor profile when selection changes.
  useEffect(() => {
    if (!selectedId) return
    let active = true
    const conv = conversations.find((c) => c.id === selectedId)

    supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active) setMessages(data || [])
      })

    if (conv) {
      supabase
        .from("chat_visitors")
        .select("*")
        .eq("id", conv.visitor_id)
        .maybeSingle()
        .then(({ data }) => {
          if (active) setVisitor(data)
        })
    }

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, supabase])

  // Realtime for the open thread: new messages + typing.
  useEffect(() => {
    if (!selectedId) return

    const channel = supabase
      .channel(`chat:${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          const next = payload.new as ChatMessage
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]))
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.from !== "visitor") return
        setVisitorTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setVisitorTyping(false), 3000)
      })
      .subscribe()

    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [selectedId, supabase])

  // Read receipts: mark visitor messages read while the thread is open.
  useEffect(() => {
    if (!selectedId) return
    const unread = messages.filter((m) => m.sender_type === "visitor" && !m.read_at)
    if (unread.length === 0) return

    const readAt = new Date().toISOString()
    supabase
      .from("chat_messages")
      .update({ read_at: readAt })
      .in("id", unread.map((m) => m.id))
      .then(() => {
        setMessages((prev) => prev.map((m) => (unread.some((u) => u.id === m.id) ? { ...m, read_at: readAt } : m)))
      })
  }, [selectedId, messages, supabase])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, selectedId])

  async function claim(id: string) {
    const { error } = await supabase
      .from("chat_conversations")
      .update({ assigned_to: currentUserId, status: "active" })
      .eq("id", id)
    if (!error) {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, assigned_to: currentUserId, status: "active" } : c))
      )
    }
  }

  async function closeConversation(id: string) {
    const closedAt = new Date().toISOString()
    const { error } = await supabase
      .from("chat_conversations")
      .update({ status: "closed", closed_at: closedAt })
      .eq("id", id)
    if (error) return

    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, status: "closed", closed_at: closedAt } : c)))

    await supabase.from("chat_messages").insert({
      conversation_id: id,
      sender_type: "system",
      body: "Conversation closed by support.",
    })

    const conv = conversations.find((c) => c.id === id)
    if (conv?.consultation_request_id) {
      await supabase.from("consultation_requests").update({ status: "completed" }).eq("id", conv.consultation_request_id)
    }
  }

  async function sendMessage() {
    if (!draft.trim() || !selectedId || sending) return
    setSending(true)
    const body = draft
    setDraft("")
    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: selectedId,
      sender_type: "agent",
      sender_id: currentUserId,
      body,
    })
    if (error) console.error("Send message error:", error)
    setSending(false)
  }

  function handleDraftChange(value: string) {
    setDraft(value)
    if (!channelRef.current) return
    const now = Date.now()
    if (now - lastTypingSentRef.current > 1500) {
      lastTypingSentRef.current = now
      channelRef.current.send({ type: "broadcast", event: "typing", payload: { from: "agent" } })
    }
  }

  async function handleAttachmentUploaded(attachment: { path: string; name: string; type: string }) {
    if (!selectedId) return
    await supabase.from("chat_messages").insert({
      conversation_id: selectedId,
      sender_type: "agent",
      sender_id: currentUserId,
      body: "",
      attachment_url: attachment.path,
      attachment_name: attachment.name,
      attachment_type: attachment.type,
    })
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`focus-ring rounded-sm border px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider transition-colors ${
                filter === f.key ? "border-ink bg-ink text-paper" : "border-ink/15 text-slate"
              }`}
            >
              {f.label} ({conversations.filter((c) => c.status === f.key).length})
            </button>
          ))}
        </div>
        <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-ok">
          ● {onlineAgents} agent{onlineAgents === 1 ? "" : "s"} online
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10">
          {filtered.length === 0 && (
            <div className="bg-paper p-8 text-center text-sm text-slate">No conversations in this view.</div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`focus-ring block w-full bg-paper p-5 text-left transition-colors hover:bg-paper-dim ${
                selectedId === c.id ? "bg-paper-dim" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-[family-name:var(--font-mono)] text-xs text-slate">
                  {new Date(c.created_at).toLocaleString()}
                </span>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider ${STATUS_COLORS[c.status]}`}
                >
                  {STATUS_LABELS[c.status]}
                </span>
              </div>
              {c.assigned_to === currentUserId && c.status === "active" && (
                <div className="mt-1 text-xs font-medium text-ok">Assigned to you</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col rounded-sm border border-ink/10 bg-paper">
          {!selected ? (
            <div className="flex h-full items-center justify-center p-7 text-sm text-slate">
              Select a conversation to view it.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5">
                <div>
                  <div className="font-medium text-ink">{visitor?.full_name || "Website visitor"}</div>
                  {visitor?.email && (
                    <a href={`mailto:${visitor.email}`} className="text-xs text-slate underline">
                      {visitor.email}
                    </a>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {selected.status === "queued" && (
                    <button
                      onClick={() => claim(selected.id)}
                      className="focus-ring rounded-sm bg-ink px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-paper"
                    >
                      Claim
                    </button>
                  )}
                  {selected.status !== "closed" && (
                    <button
                      onClick={() => closeConversation(selected.id)}
                      className="focus-ring rounded-sm border border-ink/15 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-ink/70 hover:border-ink/40"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>

              <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-5" style={{ minHeight: 0 }}>
                {messages.map((m) => (
                  <ChatMessageBubble
                    key={m.id}
                    message={m}
                    isMine={m.sender_type === "agent"}
                    attachmentUrl={attachmentUrls[m.id] ?? null}
                  />
                ))}
                {visitorTyping && (
                  <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-slate">
                    Visitor is typing…
                  </div>
                )}
              </div>

              {selected.status !== "closed" && (
                <div className="flex items-end gap-2 border-t border-ink/10 p-4">
                  <AttachmentUpload conversationId={selected.id} onUploaded={handleAttachmentUploaded} />
                  <textarea
                    value={draft}
                    onChange={(e) => handleDraftChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Reply…"
                    rows={1}
                    className="focus-ring flex-1 resize-none rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !draft.trim()}
                    className="focus-ring rounded-sm bg-ink px-4 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-paper transition-opacity disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
