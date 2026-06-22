import { ChatMessage } from "@/lib/chat"

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export default function ChatMessageBubble({
  message,
  isMine,
  attachmentUrl,
}: {
  message: ChatMessage
  isMine: boolean
  // Resolved, freshly-signed URL for message.attachment_url (which stores
  // a Storage path, not a public URL) — null while still resolving.
  attachmentUrl?: string | null
}) {
  if (message.sender_type === "system") {
    return (
      <div className="my-2 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider text-slate">
        {message.body}
      </div>
    )
  }

  const isImage = message.attachment_type?.startsWith("image/")

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-sm border px-3.5 py-2.5 text-sm leading-relaxed ${
          isMine ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper text-ink"
        }`}
      >
        {message.body && <div className="whitespace-pre-wrap">{message.body}</div>}
        {message.attachment_url && (
          <div className={message.body ? "mt-2" : ""}>
            {!attachmentUrl ? (
              <div className="text-xs italic opacity-70">Loading attachment…</div>
            ) : isImage ? (
              <a href={attachmentUrl} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic, short-lived signed Supabase Storage URL, not worth an image-host config for chat thumbnails */}
                <img
                  src={attachmentUrl}
                  alt={message.attachment_name || "Attachment"}
                  className="max-h-48 rounded-sm border border-ink/10"
                />
              </a>
            ) : (
              <a href={attachmentUrl} target="_blank" rel="noreferrer" className="text-xs underline">
                {message.attachment_name || "Download attachment"}
              </a>
            )}
          </div>
        )}
        <div
          className={`mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider ${
            isMine ? "text-paper/60" : "text-slate"
          }`}
        >
          {formatTime(message.created_at)}
          {isMine && message.read_at ? " · Read" : ""}
        </div>
      </div>
    </div>
  )
}
