"use client"

import { useEffect, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { ChatMessage } from "@/lib/chat"

// chat_messages.attachment_url stores a Storage *path*, not a public URL —
// the bucket is private, so every viewer needs a freshly-signed URL that
// respects their own read access (RLS-checked by createSignedUrl itself).
// This resolves and caches one per message id as new messages arrive.
export function useResolvedAttachments(supabase: SupabaseClient, messages: ChatMessage[]) {
  const [urls, setUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    const pending = messages.filter((m) => m.attachment_url && !urls[m.id])
    if (pending.length === 0) return

    let cancelled = false
    Promise.all(
      pending.map(async (m) => {
        const { data } = await supabase.storage
          .from("chat-attachments")
          .createSignedUrl(m.attachment_url!, 3600)
        return [m.id, data?.signedUrl ?? null] as const
      })
    ).then((results) => {
      if (cancelled) return
      setUrls((prev) => {
        const next = { ...prev }
        for (const [id, url] of results) if (url) next[id] = url
        return next
      })
    })

    return () => {
      cancelled = true
    }
  }, [messages, supabase, urls])

  return urls
}
