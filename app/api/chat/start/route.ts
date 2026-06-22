import { after, NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { detectUrgency, truncateForSubject } from "@/lib/chat"

const bodySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(1),
})

// Same rationale as app/api/consultations/route.ts: this is the one
// trusted server-side path for creating a ticket from public input, so
// it writes with the service-role key rather than depending on RLS
// policies on consultation_requests (a pre-existing table whose insert
// policy is unreliable for non-service-role callers in this project).
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

    // The widget signs the visitor in anonymously before this is ever
    // called — if there's no session, something upstream is broken.
    if (!user) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 })
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please share your name, email, and a message to start chatting." },
        { status: 400 }
      )
    }

    const { fullName, email, message } = parsed.data
    const supabase = getSupabaseAdmin()

    const { error: visitorError } = await supabase
      .from("chat_visitors")
      .upsert({ id: user.id, full_name: fullName, email })

    if (visitorError) {
      console.error("Chat visitor upsert error:", visitorError)
      return NextResponse.json({ error: "Could not start the chat." }, { status: 500 })
    }

    const { data: ticket, error: ticketError } = await supabase
      .from("consultation_requests")
      .insert({
        full_name: fullName,
        email,
        service_category_id: "general-inquiry",
        request_type: "chat_inquiry",
        subject: truncateForSubject(message),
        details: "Opened via live chat — see the linked conversation for the full transcript.",
        urgency: detectUrgency(message),
        source: "chat",
      })
      .select("id, reference_code")
      .single()

    if (ticketError || !ticket) {
      console.error("Chat ticket insert error:", ticketError)
      return NextResponse.json({ error: "Could not start the chat." }, { status: 500 })
    }

    const { data: conversation, error: conversationError } = await supabase
      .from("chat_conversations")
      .insert({
        visitor_id: user.id,
        consultation_request_id: ticket.id,
        status: "queued",
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (conversationError || !conversation) {
      console.error("Chat conversation insert error:", conversationError)
      return NextResponse.json({ error: "Could not start the chat." }, { status: 500 })
    }

    const { error: messageError } = await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      sender_type: "visitor",
      sender_id: user.id,
      body: message,
    })

    if (messageError) {
      console.error("Chat message insert error:", messageError)
      return NextResponse.json({ error: "Could not send your message." }, { status: 500 })
    }

    after(() =>
      notifyStaffOfNewChat({ fullName, email, message, referenceCode: ticket.reference_code }).catch(
        (err) => console.error("Chat staff notification failed:", err)
      )
    )

    return NextResponse.json({ conversationId: conversation.id, referenceCode: ticket.reference_code })
  } catch (err) {
    console.error("Chat start error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

async function notifyStaffOfNewChat(payload: {
  fullName: string
  email: string
  message: string
  referenceCode: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping chat staff notification.")
    return
  }

  const staffEmails = (process.env.STAFF_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  if (staffEmails.length === 0) return

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

  await resend.emails.send({
    from: fromAddress,
    to: staffEmails,
    subject: `New live chat — ${payload.referenceCode}`,
    text: `A visitor just started a live chat.

Reference: ${payload.referenceCode}
From: ${payload.fullName} <${payload.email}>

First message:
${payload.message}

Reply in the dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || ""}/dashboard/chat`,
  })
}
