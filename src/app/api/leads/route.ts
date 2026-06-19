import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

type LeadPayload = {
  email: string;
  subject?: string;
  style?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as LeadPayload;

    if (!payload.email || !EMAIL_REGEX.test(payload.email.trim())) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("portrait_leads").upsert(
      {
        email: payload.email.trim().toLowerCase(),
        subject: payload.subject ?? null,
        style: payload.style ?? null,
        source: "wizard",
      },
      { onConflict: "email" },
    );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Unknown leads error.";
    console.error("[leads]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
