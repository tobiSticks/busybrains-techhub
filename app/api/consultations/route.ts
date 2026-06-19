import { after, NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { z } from "zod"

const bodySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  serviceCategoryId: z.string().min(1),
  requestType: z.enum(["complaint", "service_request"]),
  subject: z.string().min(3),
  details: z.string().min(10),
  preferredApproach: z.string().optional(),
  urgency: z.enum(["low", "normal", "high", "urgent"]),
})

// Server-side Supabase client using the service role key —
// needed because anon users can only INSERT, but we want this
// API route to be the single trusted path for submissions.
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = bodySchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form — some details are missing or invalid." },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = getSupabaseAdmin()

    const { data: inserted, error } = await supabase
      .from("consultation_requests")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        company_name: data.companyName || null,
        service_category_id: data.serviceCategoryId,
        request_type: data.requestType,
        subject: data.subject,
        details: data.details,
        preferred_approach: data.preferredApproach || null,
        urgency: data.urgency,
      })
      .select("reference_code")
      .single()

    if (error || !inserted) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Could not save your request. Please try again shortly." },
        { status: 500 }
      )
    }

    const referenceCode = inserted.reference_code

    // Don't block the response on these, but keep the function alive until they finish —
    // a bare un-awaited promise can get cut off when Vercel freezes the function after the response.
    after(() =>
      sendNotificationEmails({ ...data, referenceCode }).catch((err) =>
        console.error("Email notification failed:", err)
      )
    )

    return NextResponse.json({ referenceCode })
  } catch (err) {
    console.error("Consultation submission error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

async function sendNotificationEmails(payload: {
  fullName: string
  email: string
  phone?: string
  companyName?: string
  serviceCategoryId: string
  requestType: string
  subject: string
  details: string
  urgency: string
  referenceCode: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email notifications.")
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const staffEmails = (process.env.STAFF_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

  // 1. Confirmation to the client
  await resend.emails.send({
    from: fromAddress,
    to: payload.email,
    subject: `Case opened — ${payload.referenceCode}`,
    text: `Hi ${payload.fullName},

Thanks for reaching out to BusyBrains Tech-Hub. Your case has been opened with reference code ${payload.referenceCode}.

Summary: ${payload.subject}

Our team will review this shortly and reach you at this email or your phone number if provided. Keep your reference code for any follow-up.

— BusyBrains Tech-Hub Corporate Services`,
  })

  // 2. Notification to staff (you + admin)
  if (staffEmails.length > 0) {
    await resend.emails.send({
      from: fromAddress,
      to: staffEmails,
      subject: `New case — ${payload.referenceCode} — ${payload.subject}`,
      text: `New consultation request received.

Reference: ${payload.referenceCode}
Type: ${payload.requestType === "complaint" ? "Complaint" : "Service request"}
Category: ${payload.serviceCategoryId}
Urgency: ${payload.urgency}

From: ${payload.fullName} <${payload.email}>
Phone: ${payload.phone || "—"}
Company: ${payload.companyName || "—"}

Subject: ${payload.subject}

Details:
${payload.details}

View in dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || ""}/dashboard`,
    })
  }
}
