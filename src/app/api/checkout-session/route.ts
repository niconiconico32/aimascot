import { NextRequest, NextResponse } from "next/server";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const stripe = getStripeServerClient();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details"],
    });

    const meta = session.metadata ?? {};
    const productType: string =
      meta.productType ??
      (meta.packageKey === "canvas-digital" ? "canvas" : "digital_download");
    const customerEmail = session.customer_details?.email ?? session.customer_email ?? "";

    const supabase = getSupabaseServerClient();
    const { data: order } = await supabase
      .from("orders")
      .select("artwork_url")
      .eq("stripe_session_id", sessionId)
      .single();

    const imageUrl = order?.artwork_url ?? meta.generatedImageUrl ?? "";

    return NextResponse.json({ customerEmail, imageUrl, productType });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Failed to retrieve session.";
    console.error("[checkout-session]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
