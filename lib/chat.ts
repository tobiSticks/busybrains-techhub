import { Urgency } from "@/lib/services"

export type ChatConversationStatus = "queued" | "active" | "closed"
export type ChatSenderType = "visitor" | "agent" | "system"

export type ChatVisitor = {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

export type ChatConversation = {
  id: string
  visitor_id: string
  consultation_request_id: string | null
  status: ChatConversationStatus
  assigned_to: string | null
  last_message_at: string | null
  created_at: string
  closed_at: string | null
}

export type ChatMessage = {
  id: string
  conversation_id: string
  sender_type: ChatSenderType
  sender_id: string | null
  body: string
  attachment_url: string | null
  attachment_name: string | null
  attachment_type: string | null
  read_at: string | null
  created_at: string
}

const URGENT_KEYWORDS = ["urgent", "asap", "emergency", "immediately", "critical"]
const HIGH_KEYWORDS = ["down", "broken", "not working", "can't access", "cannot access", "outage", "lost access", "angry", "complaint"]

// Cheap, deterministic stand-in for an AI triage call — isolated here so
// it's a one-line swap for a real model call in a later phase.
export function detectUrgency(message: string): Urgency {
  const text = message.toLowerCase()
  if (URGENT_KEYWORDS.some((k) => text.includes(k))) return "urgent"
  if (HIGH_KEYWORDS.some((k) => text.includes(k))) return "high"
  return "normal"
}

export function truncateForSubject(message: string, maxLength = 80) {
  const oneLine = message.replace(/\s+/g, " ").trim()
  if (oneLine.length <= maxLength) return oneLine || "Live chat conversation"
  return oneLine.slice(0, maxLength - 1).trimEnd() + "…"
}
