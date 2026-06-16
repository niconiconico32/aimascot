import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

/**
 * Internal route to patch upscaled_url and/or gelato_order_id on an existing
 * order. Called by your upscaling and Gelato fulfilment services once they
 * have processed the artwork.
 *
 * Body shape:
 *   { stripe_session_id: string; upscaled_url?: string; gelato_order_id?: string }
 *
 * Protect this route in production with a shared secret header, e.g.:
 *   Authorization: Bearer <INTERNAL_API_SECRET>
 */

type UpdateOrderPayload = {
  stripe_session_id?: string;
  upscaled_url?: string;
  gelato_order_id?: string;
};

export async function POST(request: NextRequest) {
  try {
    // ── Bearer-token guard (set INTERNAL_API_SECRET in .env.local) ──────────
    const internalSecret = process.env.INTERNAL_API_SECRET;
    if (!internalSecret) {
      console.error("[orders/update] INTERNAL_API_SECRET not configured");
      return NextResponse.json({ error: "Internal server configuration error." }, { status: 500 });
    }
    const authHeader = request.headers.get("authorization") ?? "";
    if (authHeader !== `Bearer ${internalSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = (await request.json()) as UpdateOrderPayload;

    if (!payload.stripe_session_id) {
      return NextResponse.json({ error: "stripe_session_id is required." }, { status: 400 });
    }

    const patch: Record<string, string> = {};
    if (payload.upscaled_url) patch.upscaled_url = payload.upscaled_url;
    if (payload.gelato_order_id) patch.gelato_order_id = payload.gelato_order_id;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: "At least one of upscaled_url or gelato_order_id is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("orders")
      .update(patch)
      .eq("stripe_session_id", payload.stripe_session_id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Unknown order update error.";
    console.error("[orders/update]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
