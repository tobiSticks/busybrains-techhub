import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const bodySchema = z.object({
  fullName: z.string().min(2),
  role: z.string().optional(),
  company: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10),
})

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
    const { error } = await supabase.from("testimonials").insert({
      full_name: data.fullName,
      role: data.role || null,
      company: data.company || null,
      rating: data.rating,
      message: data.message,
    })

    if (error) {
      console.error("Testimonial insert error:", error)
      return NextResponse.json({ error: "Could not save your feedback." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Testimonial submission error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
