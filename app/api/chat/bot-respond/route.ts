import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { APICallError, generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { botTurnSchema, buildSystemPrompt, DEFAULT_CHAT_BOT_MODEL, MAX_BOT_REPLIES } from "@/lib/chatBot"
import { ChatMessage } from "@/lib/chat"

const bodySchema = z.object({
  conversationId: z.string().uuid(),
})

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const sessionClient = await createClient()
    const {
      data: { user },
    } = await sessionClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 })
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 })
    }

    const { conversationId } = parsed.data
    const admin = getSupabaseAdmin()

    const { data: conversation } = await admin
      .from("chat_conversations")
      .select("id, visitor_id, status, consultation_request_id")
      .eq("id", conversationId)
      .single()

    // Visitor doesn't own this conversation, or it's already past the bot
    // phase (escalated, claimed early, or closed) — nothing to do.
    if (!conversation || conversation.visitor_id !== user.id || conversation.status !== "bot") {
      return NextResponse.json({ skipped: true })
    }

    const { data: history } = await admin
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    const messages = (history || []) as ChatMessage[]
    const botReplyCount = messages.filter((m) => m.sender_type === "bot").length
    const forceEscalate = botReplyCount >= MAX_BOT_REPLIES

    let turn: { reply: string; shouldEscalate: boolean; category: string; urgency: "low" | "normal" | "high" | "urgent" }

    if (forceEscalate) {
      turn = {
        reply: "Let me connect you with a member of our team for this one.",
        shouldEscalate: true,
        category: "general-inquiry",
        urgency: "normal",
      }
    } else {
      try {
        const result = await generateText({
          model: process.env.CHAT_BOT_MODEL || DEFAULT_CHAT_BOT_MODEL,
          system: buildSystemPrompt(),
          messages: messages
            .filter((m) => m.sender_type === "visitor" || m.sender_type === "bot")
            .map((m) => ({
              role: m.sender_type === "visitor" ? ("user" as const) : ("assistant" as const),
              content: m.body,
            })),
          output: Output.object({ schema: botTurnSchema }),
          providerOptions: {
            gateway: {
              user: user.id,
              tags: ["feature:chat-bot"],
            },
          },
        })
        turn = result.output
      } catch (err) {
        console.error("Chat bot generation error:", err)
        const status = APICallError.isInstance(err) ? err.statusCode : undefined
        turn = {
          reply:
            status === 402
              ? "I'm at capacity right now — let me get a team member to help instead."
              : "I'm having trouble right now — let me get a team member to help.",
          shouldEscalate: true,
          category: "general-inquiry",
          urgency: "normal",
        }
      }
    }

    const { error: insertError } = await admin.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "bot",
      sender_id: null,
      body: turn.reply,
    })

    if (insertError) {
      console.error("Bot message insert error:", insertError)
      return NextResponse.json({ error: "Could not send the bot's reply." }, { status: 500 })
    }

    await admin
      .from("chat_conversations")
      .update({
        last_message_at: new Date().toISOString(),
        ...(turn.shouldEscalate ? { status: "queued" } : {}),
      })
      .eq("id", conversationId)

    if (conversation.consultation_request_id) {
      await admin
        .from("consultation_requests")
        .update({ service_category_id: turn.category, urgency: turn.urgency })
        .eq("id", conversation.consultation_request_id)
    }

    return NextResponse.json({ reply: turn.reply, shouldEscalate: turn.shouldEscalate })
  } catch (err) {
    console.error("Bot respond error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
