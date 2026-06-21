import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { caseResponseEmailHtml } from "@/lib/email-templates"

const bodySchema = z.object({
  message: z.string().min(3),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authorized." }, { status: 401 })
    }

    const json = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Write a message before sending." }, { status: 400 })
    }

    const { data: caseRow, error: caseError } = await supabase
      .from("consultation_requests")
      .select("full_name, email, subject, reference_code")
      .eq("id", id)
      .single()

    if (caseError || !caseRow) {
      return NextResponse.json({ error: "Case not found." }, { status: 404 })
    }

    const { error: insertError } = await supabase.from("case_responses").insert({
      consultation_request_id: id,
      message: parsed.data.message,
      sent_by: user.id,
    })

    if (insertError) {
      console.error("Case response insert error:", insertError)
      return NextResponse.json({ error: "Could not save your response." }, { status: 500 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — response saved but no email sent.")
      return NextResponse.json({ ok: true, emailed: false })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    await resend.emails.send({
      from: fromAddress,
      to: caseRow.email,
      subject: `Re: ${caseRow.subject} — ${caseRow.reference_code}`,
      text: `Dear ${caseRow.full_name},\n\nCase Reference ID: ${caseRow.reference_code}\nRe: ${caseRow.subject}\n\n${parsed.data.message}\n\nBest regards,\nBusyBrains Tech-Hub Corporate Services`,
      html: caseResponseEmailHtml({
        fullName: caseRow.full_name,
        referenceCode: caseRow.reference_code,
        subject: caseRow.subject,
        message: parsed.data.message,
      }),
    })

    return NextResponse.json({ ok: true, emailed: true })
  } catch (err) {
    console.error("Case response error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
