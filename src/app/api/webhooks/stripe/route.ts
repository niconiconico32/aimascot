import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { createGelatoOrder, getCanvasProductUid, splitFullName } from "@/lib/gelato";
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
        // Return 200 so Stripe doesn't retry — stragglers handled via /api/orders/confirm
        return NextResponse.json({ ok: false, error: error.message });
      }

      // -----------------------------------------------------------------------
      // Gelato fulfillment — canvas-digital orders only
      // -----------------------------------------------------------------------
      const packageKey = session.metadata?.packageKey;
      if (packageKey === "canvas-digital") {
        try {
          // Fetch artwork_url and size_selected stored at checkout time
          const { data: order, error: selectError } = await supabase
            .from("orders")
            .select("artwork_url, size_selected")
            .eq("stripe_session_id", session.id)
            .single();

          if (selectError || !order?.artwork_url) {
            console.error("[stripe-webhook] Could not read order for Gelato:", selectError?.message ?? "no artwork_url");
          } else {
            // Build shipping address
            const addr = shippingAddress as {
              line1?: string | null;
              line2?: string | null;
              city?: string | null;
              state?: string | null;
              postal_code?: string | null;
              country?: string | null;
            } | null;

            const rawName =
              (session.shipping_details as { name?: string | null } | null)?.name ??
              session.customer_details?.name ??
              null;
            const { firstName, lastName } = splitFullName(rawName);
            const email =
              session.customer_details?.email ?? session.customer_email ?? "";

            const gelatoAddress = {
              firstName,
              lastName,
              addressLine1: addr?.line1 ?? "",
              ...(addr?.line2 ? { addressLine2: addr.line2 } : {}),
              city: addr?.city ?? "",
              ...(addr?.state ? { state: addr.state } : {}),
              postCode: addr?.postal_code ?? "",
              country: addr?.country ?? "",
              email,
            };

            const size = order.size_selected ?? session.metadata?.size ?? "8 x 10";
            const productUid = getCanvasProductUid(size);
            const orderRefId = `VP-${session.id.slice(-12)}`;

            const gelatoOrder = await createGelatoOrder({
              orderReferenceId: orderRefId,
              customerReferenceId: email || session.id,
              currency: "USD",
              productUid,
              artworkUrl: order.artwork_url,
              shippingAddress: gelatoAddress,
            });

            // Save Gelato order ID back to Supabase
            const { error: updateError } = await supabase
              .from("orders")
              .update({ gelato_order_id: gelatoOrder.id })
              .eq("stripe_session_id", session.id);

            if (updateError) {
              console.error("[stripe-webhook] Failed to save gelato_order_id:", updateError.message);
            } else {
              console.log(`[stripe-webhook] Gelato order created: ${gelatoOrder.id}`);
            }
          }
        } catch (gelatoErr) {
          // Do NOT rethrow — Stripe must receive a 200 regardless
          console.error("[stripe-webhook] Gelato order creation failed:", gelatoErr);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
