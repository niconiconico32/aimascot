import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { sendOrderConfirmation } from "@/lib/email";
import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import {
  createGelatoOrder,
  getCanvasProductUid,
  getMugProductUid,
  splitFullName,
} from "@/lib/gelato";

export const runtime = "nodejs";

// ─── Types ─────────────────────────────────────────────────────────────────────

type AddressLike = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type ShippingDetails = {
  name?: string | null;
  address?: Stripe.Address | null;
};

type SessionComplete = Stripe.Checkout.Session & {
  shipping_details?: ShippingDetails | null;
};

type FulfillmentData = {
  sessionId: string;
  customerEmail: string;
  productType: string;
  isCanvas: boolean;
  wantsMug: boolean;
  size: string;
  imageUrl: string;
  shippingAddress: AddressLike | null;
  shippingName: string | null | undefined;
};

// ─── Fulfillment Orchestration ─────────────────────────────────────────────────

async function processOrderFulfillment(data: FulfillmentData): Promise<void> {
  const supabase = getSupabaseServerClient();
  const finalImageUrl = data.imageUrl;

  // ── Step 2: Send confirmation email via Resend (all orders) ────────────────
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("[webhook] RESEND_API_KEY not configured — skipping email");
    } else if (!data.customerEmail) {
      console.warn("[webhook] No customer email — skipping email");
    } else {
      await sendOrderConfirmation({
        sessionId: data.sessionId,
        customerEmail: data.customerEmail,
        isCanvas: data.isCanvas,
        wantsMug: data.wantsMug,
        size: data.size,
        imageUrl: finalImageUrl,
      });

      const now = new Date().toISOString();
      await supabase
        .from("orders")
        .update({ email_status: "sent", email_sent_at: now })
        .eq("stripe_session_id", data.sessionId)
        .then(() => {});
    }
  } catch (emailErr) {
    console.error("[webhook] Email delivery failed (non-blocking):", emailErr);
    const now = new Date().toISOString();
    await supabase
      .from("orders")
      .update({ email_status: "failed", email_sent_at: now })
      .eq("stripe_session_id", data.sessionId)
      .then(() => {});
  }

  // ── Step 3: Canvas fulfillment via Gelato ──────────────────────────────────
  if (data.isCanvas) {
    // TO-DO: Verify Gelato DRAFT_MODE is disabled in production. Add
    //         webhook-tracking for Gelato status callbacks to update order
    //         status to SHIPPED when Gelato confirms shipment.
    try {
      const { firstName, lastName } = splitFullName(data.shippingName);

      const gelatoAddress = {
        firstName,
        lastName,
        addressLine1: data.shippingAddress?.line1 ?? "",
        ...(data.shippingAddress?.line2
          ? { addressLine2: data.shippingAddress.line2 }
          : {}),
        city: data.shippingAddress?.city ?? "",
        ...(data.shippingAddress?.state
          ? { state: data.shippingAddress.state }
          : {}),
        postCode: data.shippingAddress?.postal_code ?? "",
        country: data.shippingAddress?.country ?? "",
        email: data.customerEmail,
      };

      const productUid = getCanvasProductUid(data.size);
      const orderRefId = `VP-${data.sessionId.slice(-12)}`;

      console.log(
        "[webhook] ▶ Creating Gelato order — uid:",
        productUid,
        "ref:",
        orderRefId,
      );

      const gelatoOrder = await createGelatoOrder({
        orderReferenceId: orderRefId,
        customerReferenceId: data.customerEmail || data.sessionId,
        currency: "USD",
        productUid,
        artworkUrl: finalImageUrl,
        shippingAddress: gelatoAddress,
      });

      const { error: gelatoSaveErr } = await supabase
        .from("orders")
        .update({ gelato_order_id: gelatoOrder.id })
        .eq("stripe_session_id", data.sessionId);

      if (gelatoSaveErr) {
        console.error(
          "[webhook] Could not save gelato_order_id:",
          gelatoSaveErr.message,
        );
      } else {
        console.log("[webhook] ✓ Gelato order created:", gelatoOrder.id);
      }
    } catch (gelatoErr) {
      console.error("[webhook] Gelato fulfillment failed:", gelatoErr);
    }
  }

  // ── Step 3b: Mug fulfillment via Gelato ─────────────────────────────────────
  if (data.wantsMug) {
    try {
      const { firstName, lastName } = splitFullName(data.shippingName);

      const gelatoAddress = {
        firstName,
        lastName,
        addressLine1: data.shippingAddress?.line1 ?? "",
        ...(data.shippingAddress?.line2
          ? { addressLine2: data.shippingAddress.line2 }
          : {}),
        city: data.shippingAddress?.city ?? "",
        ...(data.shippingAddress?.state
          ? { state: data.shippingAddress.state }
          : {}),
        postCode: data.shippingAddress?.postal_code ?? "",
        country: data.shippingAddress?.country ?? "",
        email: data.customerEmail,
      };

      const productUid = getMugProductUid();
      const orderRefId = `VP-${data.sessionId.slice(-12)}`;

      console.log(
        "[webhook] ▶ Creating Gelato mug order — uid:",
        productUid,
        "ref:",
        orderRefId,
      );

      const mugOrder = await createGelatoOrder({
        orderReferenceId: `${orderRefId}-mug`,
        customerReferenceId: data.customerEmail || data.sessionId,
        currency: "USD",
        productUid,
        artworkUrl: finalImageUrl,
        quantity: 1,
        shippingAddress: gelatoAddress,
      });

      const { error: mugSaveErr } = await supabase
        .from("orders")
        .update({ mug_gelato_order_id: mugOrder.id })
        .eq("stripe_session_id", data.sessionId);

      if (mugSaveErr) {
        console.warn(
          "[webhook] Could not save mug_gelato_order_id (column may not exist):",
          mugSaveErr.message,
        );
      } else {
        console.log("[webhook] ✓ Mug Gelato order created:", mugOrder.id);
      }
    } catch (mugErr) {
      console.error("[webhook] Mug fulfillment failed:", mugErr);
    }
  }

  // ── Step 4: Mark order as COMPLETED ─────────────────────────────────────────
  // TO-DO: Add a `completed_at` timestamp column to the orders table for
  //         analytics and SLA monitoring. Also consider writing to a
  //         `fulfillment_log` table for a complete audit trail.
  try {
    const { error: completeErr } = await supabase
      .from("orders")
      .update({ status: "COMPLETED" })
      .eq("stripe_session_id", data.sessionId);

    if (completeErr) {
      console.error(
        "[webhook] COMPLETED status update failed:",
        completeErr.message,
      );
    } else {
      console.log("[webhook] ✓ Order marked COMPLETED:", data.sessionId);
    }
  } catch (completeErr) {
    console.error(
      "[webhook] COMPLETED status update threw:",
      completeErr,
    );
  }
}

// ─── Webhook Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  // ── Verify Stripe webhook signature ─────────────────────────────────────────
  let event: Stripe.Event;
  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Signature verification failed";
    console.error("[webhook] Signature verification error:", message);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  // Only process completed checkout sessions
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as SessionComplete;

  // Only process paid sessions
  if (session.payment_status !== "paid") {
    console.log(
      "[webhook] payment_status:",
      session.payment_status,
      "— skipping",
    );
    return NextResponse.json({ received: true });
  }

  // ── Extract metadata (dual convention) ─────────────────────────────────────
  const meta = session.metadata ?? {};

  // Simplified flow: metadata.productType = "canvas" | "digital_download"
  // Cart flow:       metadata.packageKey   = "canvas-digital" | "digital"
  const productType: string =
    meta.baseProduct ??
    meta.productType ??
    (meta.packageKey === "canvas-digital" ? "canvas" : "digital_download");

  const isCanvas = productType === "canvas";
  const wantsMug = meta.wantsMug === "true";
  const size = meta.size ?? "";
  const generatedImageUrl = meta.generatedImageUrl ?? "";
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? "";
  const shippingDetails = session.shipping_details;
  const shippingAddress = (
    shippingDetails?.address ??
    session.customer_details?.address ??
    null
  ) as AddressLike | null;

  console.log(
    "[webhook] checkout.session.completed — id:",
    session.id,
    "| productType:",
    productType,
    "| isCanvas:",
    isCanvas,
    "| wantsMug:",
    wantsMug,
    "| size:",
    size,
  );
  console.log("[webhook] customerEmail:", customerEmail || "(none)");

  // ── Idempotency: skip if already processed ──────────────────────────────────
  const supabase = getSupabaseServerClient();
  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  const currentStatus = (existing?.status ?? "").toUpperCase();

  if (
    currentStatus === "PAID" ||
    currentStatus === "PROCESSING" ||
    currentStatus === "COMPLETED"
  ) {
    console.log(
      "[webhook] Idempotency hit — order already",
      currentStatus,
      "— returning 200",
    );
    return NextResponse.json({ received: true });
  }

  // ── Resolve image URL: metadata first, fall back to Supabase ────────────────
  let imageUrl = generatedImageUrl;

  if (!imageUrl) {
    const { data: order } = await supabase
      .from("orders")
      .select("artwork_url")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (order?.artwork_url) {
      imageUrl = order.artwork_url;
      console.log("[webhook] Using Supabase artwork_url as upscale source");
    }
  }

  // ── Mark as PROCESSING immediately (upsert) ─────────────────────────────────
  const { error: processingErr } = existing
    ? await supabase
        .from("orders")
        .update({
          customer_email: customerEmail || null,
          shipping_address: shippingAddress,
          status: "PROCESSING",
          ...(imageUrl ? { artwork_url: imageUrl } : {}),
        })
        .eq("stripe_session_id", session.id)
    : await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: customerEmail || null,
        shipping_address: shippingAddress,
        status: "PROCESSING",
        product_type: productType,
        artwork_url: imageUrl || null,
        size_selected: size || null,
      });

  if (processingErr) {
    console.error(
      "[webhook] PROCESSING status update/insert failed:",
      processingErr.message,
    );
    // Return 200 so Stripe doesn't retry — proceed with fulfillment anyway
  } else {
    console.log("[webhook] ✓ Order status → PROCESSING");
  }

  // ── Fire-and-forget: do NOT await fulfillment ──────────────────────────────
  // Stripe requires a 200 response within ~5 seconds; fulfillment (upscaling,
  // Gelato, email) runs in the background.
  processOrderFulfillment({
    sessionId: session.id,
    customerEmail,
    productType,
    isCanvas,
    wantsMug,
    size,
    imageUrl,
    shippingAddress,
    shippingName: shippingDetails?.name,
  }).catch((err: unknown) => {
    console.error("[webhook] Unhandled fulfillment error:", err);
  });

  console.log("[webhook] ✓ 200 returned — fulfillment running in background");
  return NextResponse.json({ received: true });
}
