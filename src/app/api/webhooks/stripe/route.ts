import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// Disable body parsing so we can verify the raw Stripe signature
export const preferredRegion = "auto";

type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
  shipping_details?: {
    address?: Stripe.Address | null;
  } | null;
};

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as CheckoutSessionWithShipping;

    if (session.payment_status === "paid") {
      const supabase = getSupabaseServerClient();

      const shippingAddress =
        session.shipping_details?.address ?? session.customer_details?.address ?? null;

      const { error } = await supabase
        .from("orders")
        .update({
          customer_email: session.customer_details?.email ?? session.customer_email ?? null,
          shipping_address: shippingAddress,
          status: "paid",
        })
        .eq("stripe_session_id", session.id);

      if (error) {
        console.error("[stripe-webhook] Supabase update error:", error.message);
        // Return 200 so Stripe doesn't retry — we'll catch stragglers via /api/orders/confirm
        return NextResponse.json({ ok: false, error: error.message });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
