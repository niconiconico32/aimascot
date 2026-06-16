import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

type ConfirmOrderPayload = {
  sessionId?: string;
};

type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    address?: Stripe.Address | null;
  } | null;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ConfirmOrderPayload;

    if (!payload.sessionId) {
      return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
    }

    const stripe = getStripeServerClient();
    const supabase = getSupabaseServerClient();
    const session = (await stripe.checkout.sessions.retrieve(payload.sessionId, {
      expand: ["customer_details"],
    })) as CheckoutSessionWithShipping;

    const shippingAddress = session.shipping_details?.address ?? session.customer_details?.address ?? null;
    const status = session.payment_status === "paid" ? "paid" : "pending_payment";

    const { error } = await supabase
      .from("orders")
      .update({
        customer_email: session.customer_details?.email ?? session.customer_email ?? null,
        shipping_address: shippingAddress,
        status,
      })
      .eq("stripe_session_id", payload.sessionId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Unknown order confirmation error.";
    console.error("[orders/confirm]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}