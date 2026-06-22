"use client"

import { useRef, useState } from "react"
import { Loader2, Paperclip } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export default function AttachmentUpload({
  conversationId,
  onUploaded,
  disabled,
}: {
  conversationId: string
  onUploaded: (attachment: { path: string; name: string; type: string }) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (file.size > MAX_SIZE_BYTES) {
      setError("File is too large (10MB max).")
      return
    }
    setError(null)
    setUploading(true)

    const supabase = createClient()
    const path = `${conversationId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage.from("chat-attachments").upload(path, file)

    setUploading(false)

    if (uploadError) {
      console.error("Attachment upload error:", uploadError)
      setError("Could not upload file.")
      return
    }

    onUploaded({ path, name: file.name, type: file.type })
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="focus-ring rounded-sm border border-ink/15 p-2 text-slate transition-colors hover:border-ink/40 hover:text-ink disabled:opacity-50"
        aria-label="Attach a file"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
      </button>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  )
}
