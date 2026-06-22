"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, Send, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ChatConversation, ChatMessage } from "@/lib/chat"
import { useResolvedAttachments } from "@/lib/useResolvedAttachments"
import ChatMessageBubble from "@/components/ChatMessageBubble"
import AttachmentUpload from "@/components/AttachmentUpload"

const CONVERSATION_KEY = "bb_chat_conversation_id"

const STATUS_LABEL: Record<ChatConversation["status"], string> = {
  bot: "Chatting with our AI assistant",
  queued: "Waiting for an agent…",
  active: "Connected with support",
  closed: "Conversation closed",
}

export default function ChatWidget() {
  const pathname = usePathname()
  const hidden = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login")

  const [supabase] = useState(() => createClient())
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<"prechat" | "chat">("prechat")
  const [userId, setUserId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agentTyping, setAgentTyping] = useState(false)
  const [botThinking, setBotThinking] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingSentRef = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)

  const attachmentUrls = useResolvedAttachments(supabase, messages)

  // Restore an existing conversation (same browser, same anonymous session) on mount.
  useEffect(() => {
    let active = true
    ;(async () => {
      const storedId = localStorage.getItem(CONVERSATION_KEY)
      if (!storedId) return

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        localStorage.removeItem(CONVERSATION_KEY)
        return
      }

      const { data: existing } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", storedId)
        .maybeSingle()

      if (!active) return
      if (!existing) {
        localStorage.removeItem(CONVERSATION_KEY)
        return
      }

      const { data: history } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", storedId)
        .order("created_at", { ascending: true })

      if (!active) return
      setUserId(sessionData.session.user.id)
      setConversation(existing)
      setMessages(history || [])
      setPhase("chat")
    })()
    return () => {
      active = false
    }
  }, [supabase])

  // Realtime: incoming messages, conversation status changes, typing.
  useEffect(() => {
    if (!conversation) return

    const channel = supabase
      .channel(`chat:${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          const next = payload.new as ChatMessage
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]))
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_conversations", filter: `id=eq.${conversation.id}` },
        (payload) => setConversation(payload.new as ChatConversation)
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.from !== "agent") return
        setAgentTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setAgentTyping(false), 3000)
      })
      .subscribe()

    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
    // Deliberately keyed on conversation?.id, not the whole object — the UPDATE
    // handler above replaces `conversation` on every status change, which would
    // otherwise tear down and resubscribe the channel on every single update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id, supabase])

  // Mark agent messages as read while the panel is open.
  useEffect(() => {
    if (!open || !conversation) return
    const unread = messages.filter((m) => m.sender_type === "agent" && !m.read_at)
    if (unread.length === 0) return

    const readAt = new Date().toISOString()
    supabase
      .from("chat_messages")
      .update({ read_at: readAt })
      .in("id", unread.map((m) => m.id))
      .then(() => {
        setMessages((prev) =>
          prev.map((m) => (unread.some((u) => u.id === m.id) ? { ...m, read_at: readAt } : m))
        )
      })
  }, [open, conversation, messages, supabase])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  async function triggerBotResponse(conversationId: string) {
    setBotThinking(true)
    try {
      await fetch("/api/chat/bot-respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      })
    } catch {
      // Best-effort — if this fails, the bot just doesn't reply this turn.
      // The visitor can still send another message or wait for staff.
    }
    setBotThinking(false)
  }

  async function ensureSession() {
    const { data } = await supabase.auth.getSession()
    if (data.session) return data.session.user.id
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
    if (signInError || !signInData.session) throw new Error("Could not start a chat session.")
    return signInData.session.user.id
  }

  async function handleStartChat() {
    if (!fullName.trim() || !email.trim() || !draft.trim() || sending) return
    setSending(true)
    setError(null)
    try {
      await ensureSession()
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, message: draft }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Could not start the chat.")
        setSending(false)
        return
      }

      localStorage.setItem(CONVERSATION_KEY, json.conversationId)
      const { data: sessionData } = await supabase.auth.getSession()
      const [{ data: conv }, { data: history }] = await Promise.all([
        supabase.from("chat_conversations").select("*").eq("id", json.conversationId).single(),
        supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", json.conversationId)
          .order("created_at", { ascending: true }),
      ])

      setUserId(sessionData.session?.user.id ?? null)
      setConversation(conv)
      setMessages(history || [])
      setPhase("chat")
      setDraft("")

      if (conv?.status === "bot") triggerBotResponse(conv.id)
    } catch {
      setError("Could not start the chat. Please try again.")
    }
    setSending(false)
  }

  async function handleSendMessage() {
    if (!draft.trim() || !conversation || !userId || sending || botThinking) return
    setSending(true)
    const body = draft
    setDraft("")
    const { error: sendError } = await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "visitor",
      sender_id: userId,
      body,
    })
    if (sendError) setError("Could not send your message.")
    setSending(false)

    if (!sendError && conversation.status === "bot") triggerBotResponse(conversation.id)
  }

  function handleDraftChange(value: string) {
    setDraft(value)
    if (!channelRef.current) return
    const now = Date.now()
    if (now - lastTypingSentRef.current > 1500) {
      lastTypingSentRef.current = now
      channelRef.current.send({ type: "broadcast", event: "typing", payload: { from: "visitor" } })
    }
  }

  async function handleAttachmentUploaded(attachment: { path: string; name: string; type: string }) {
    if (!conversation || !userId) return
    const { error: attachError } = await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "visitor",
      sender_id: userId,
      body: "",
      attachment_url: attachment.path,
      attachment_name: attachment.name,
      attachment_type: attachment.type,
    })
    if (attachError) setError("Could not send your attachment.")
  }

  function startNewConversation() {
    localStorage.removeItem(CONVERSATION_KEY)
    setConversation(null)
    setMessages([])
    setPhase("prechat")
    setDraft("")
  }

  if (hidden) return null

  const isClosed = conversation?.status === "closed"

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg transition-transform hover:scale-105"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(600px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-2xl">
          <div className="border-b border-ink/10 bg-ink px-4 py-3 text-paper">
            <div className="font-[family-name:var(--font-display)] text-sm font-semibold">
              BusyBrains Tech-Hub Support
            </div>
            {conversation && (
              <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-paper/70">
                {STATUS_LABEL[conversation.status]}
              </div>
            )}
          </div>

          {phase === "prechat" ? (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              <p className="text-sm text-slate">
                Tell us a bit about yourself and what you need — we&apos;ll connect you with the right
                person.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="focus-ring rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Your email"
                  className="focus-ring rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm"
                />
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="How can we help?"
                  rows={3}
                  className="focus-ring resize-none rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm"
                />
                {error && <div className="text-xs text-red-600">{error}</div>}
                <button
                  onClick={handleStartChat}
                  disabled={sending || !fullName.trim() || !email.trim() || !draft.trim()}
                  className="focus-ring rounded-sm bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity disabled:opacity-50"
                >
                  {sending ? "Starting…" : "Start chat"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m) => (
                  <ChatMessageBubble
                    key={m.id}
                    message={m}
                    isMine={m.sender_type === "visitor"}
                    attachmentUrl={attachmentUrls[m.id] ?? null}
                  />
                ))}
                {agentTyping && (
                  <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-slate">
                    Agent is typing…
                  </div>
                )}
                {botThinking && (
                  <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-slate">
                    AI assistant is typing…
                  </div>
                )}
              </div>

              {error && <div className="px-4 pb-1 text-xs text-red-600">{error}</div>}

              {isClosed ? (
                <div className="border-t border-ink/10 p-4">
                  <button
                    onClick={startNewConversation}
                    className="focus-ring w-full rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium transition-colors hover:border-ink/40"
                  >
                    Start a new conversation
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2 border-t border-ink/10 p-3">
                  {conversation && (
                    <AttachmentUpload
                      conversationId={conversation.id}
                      onUploaded={handleAttachmentUploaded}
                      disabled={botThinking}
                    />
                  )}
                  <textarea
                    value={draft}
                    onChange={(e) => handleDraftChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={botThinking}
                    placeholder="Type a message…"
                    rows={1}
                    className="focus-ring flex-1 resize-none rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || botThinking || !draft.trim()}
                    className="focus-ring rounded-sm bg-ink p-2.5 text-paper transition-opacity disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
