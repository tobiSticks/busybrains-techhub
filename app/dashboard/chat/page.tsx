import { createClient } from "@/lib/supabase/server"
import ChatDashboard from "@/components/ChatDashboard"
import { ChatConversation } from "@/lib/chat"

export default async function DashboardChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from("chat_conversations")
    .select("*")
    .order("last_message_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        Live Chat
      </h1>
      <ChatDashboard
        initialConversations={(conversations as ChatConversation[]) || []}
        currentUserId={user!.id}
      />
    </div>
  )
}
