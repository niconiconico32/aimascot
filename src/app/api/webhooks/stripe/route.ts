import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { createGelatoOrder, getCanvasProductUid, splitFullName } from "@/lib/gelato";
import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const preferredRegion = "auto";

type ShippingDetails = {
  name?: string | null;
  address?: Stripe.Address | null;
};

type SessionComplete = Stripe.Checkout.Session & {
  shipping_details?: ShippingDetails | null;
};

type AddressLike = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — fal.ai 4K upscale (for print-quality files sent to Gelato)
// Uses fal-ai/aura-sr at 4× factor. Skipped gracefully for non-HTTPS sources.
// ─────────────────────────────────────────────────────────────────────────────
async function upscaleImageTo4K(imageUrl: string): Promise<string> {
  if (!imageUrl.startsWith("https://")) {
    console.warn("[webhook] upscale skipped — URL is not HTTPS (data URL or empty)");
    return imageUrl;
  }

  console.log("[webhook] ▶ fal-ai/aura-sr upscaling:", imageUrl);

  type AuraSrOutput = {
    image?: { url: string };
    images?: { url: string }[];
  };

  const result = await fal.subscribe("fal-ai/aura-sr", {
    input: {
      image_url: imageUrl,
      upscale_factor: 4,
      overlapping_tiles: true,
    },
  });

  const output = result.data as AuraSrOutput;
  const upscaledUrl = output?.image?.url ?? output?.images?.[0]?.url;

  if (!upscaledUrl) {
    throw new Error("fal-ai/aura-sr returned no image URL");
  }

  console.log("[webhook] ✓ Upscale done:", upscaledUrl);
  return upscaledUrl;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 6 — Klaviyo: fire "Order Confirmed" event via REST API v2024-02-15
// Silently skipped when KLAVIYO_API_KEY is not configured.
// ─────────────────────────────────────────────────────────────────────────────
async function notifyKlaviyo(params: {
  email: string;
  stripeSessionId: string;
  productType: string;
  size: string;
  hdImageUrl: string;
}): Promise<void> {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    console.warn("[webhook] KLAVIYO_API_KEY not configured — skipping Klaviyo notification");
    return;
  }

  const res = await fetch("https://a.klaviyo.com/api/events/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: "2024-02-15",
    },
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: {
            data: { type: "metric", attributes: { name: "Order Confirmed" } },
          },
          profile: {
            data: { type: "profile", attributes: { email: params.email } },
          },
          properties: {
            stripeSessionId: params.stripeSessionId,
            productType:     params.productType,
            size:            params.size,
            hdImageUrl:      params.hdImageUrl,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[webhook] Klaviyo API error:", res.status, body);
  } else {
    console.log("[webhook] ✓ Klaviyo 'Order Confirmed' fired →", params.email);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook handler
// ─────────────────────────────────────────────────────────────────────────────
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

  // ── Step 1: Verify Stripe webhook signature ─────────────────────────────────
  let event: Stripe.Event;
  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  // Only process checkout completions — return 200 for all other event types
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true });
  }

  const session = event.data.object as SessionComplete;
  console.log("[webhook] checkout.session.completed — id:", session.id);

  if (session.payment_status !== "paid") {
    console.log("[webhook] payment_status:", session.payment_status, "— skipping");
    return NextResponse.json({ ok: true });
  }

  // ── Step 2: Extract metadata & shipping details ─────────────────────────────
  const meta = session.metadata ?? {};

  // Unified productType: simplified flow sends "canvas" / "digital_download";
  // cart flow sends packageKey "canvas-digital" / "digital".
  const productType: string =
    meta.productType ??
    (meta.packageKey === "canvas-digital" ? "canvas" : "digital_download");
  const size             = meta.size ?? "8x10";
  const generatedImageUrl = meta.generatedImageUrl ?? "";   // clean Fal URL (when available)
  const isCanvas         = productType === "canvas";

  const shippingDetails  = session.shipping_details;
  const shippingAddress  = (shippingDetails?.address ?? session.customer_details?.address ?? null) as AddressLike | null;
  const customerEmail    = session.customer_details?.email ?? session.customer_email ?? "";

  console.log("[webhook] productType:", productType, "| size:", size, "| isCanvas:", isCanvas);
  console.log("[webhook] generatedImageUrl:", generatedImageUrl || "(not provided)");
  console.log("[webhook] customerEmail:", customerEmail || "(none)");

  const supabase = getSupabaseServerClient();

  // ── Step 3: Upscale to 4K ──────────────────────────────────────────────────
  // Priority: metadata URL → Supabase artwork_url (cart flow fallback)
  let hdImageUrl = generatedImageUrl;

  try {
    if (generatedImageUrl.startsWith("https://")) {
      hdImageUrl = await upscaleImageTo4K(generatedImageUrl);
    } else {
      // Cart flow: clean URL may be stored as artwork_url in Supabase
      const { data: existing } = await supabase
        .from("orders")
        .select("artwork_url")
        .eq("stripe_session_id", session.id)
        .single();

      const stored = existing?.artwork_url ?? "";
      if (stored.startsWith("https://")) {
        console.log("[webhook] Using Supabase artwork_url as upscale source");
        hdImageUrl = await upscaleImageTo4K(stored);
      } else {
        console.warn("[webhook] No upscalable URL found — Gelato will use the original source");
        hdImageUrl = stored;
      }
    }
  } catch (upscaleErr) {
    console.error("[webhook] Upscale failed — falling back to source URL:", upscaleErr);
    // hdImageUrl already holds the best available URL at this point
  }

  // ── Step 4: Persist in Supabase ────────────────────────────────────────────
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      customer_email:   customerEmail || null,
      shipping_address: shippingAddress,
      status:           "paid",
      ...(hdImageUrl ? { artwork_url: hdImageUrl } : {}),
    })
    .eq("stripe_session_id", session.id);

  if (updateError) {
    console.error("[webhook] Supabase update error:", updateError.message);
    // Return 200 so Stripe doesn't retry — stragglers resolved via /api/orders/confirm
    return NextResponse.json({ ok: false, error: updateError.message });
  }
  console.log("[webhook] ✓ Supabase updated (status: paid)");

  // ── Step 5: Gelato fulfillment — canvas orders only ────────────────────────
  if (isCanvas) {
    try {
      const rawName    = shippingDetails?.name ?? session.customer_details?.name ?? null;
      const { firstName, lastName } = splitFullName(rawName);

      const gelatoAddress = {
        firstName,
        lastName,
        addressLine1: shippingAddress?.line1 ?? "",
        ...(shippingAddress?.line2 ? { addressLine2: shippingAddress.line2 } : {}),
        city:     shippingAddress?.city    ?? "",
        ...(shippingAddress?.state ? { state: shippingAddress.state } : {}),
        postCode: shippingAddress?.postal_code ?? "",
        country:  shippingAddress?.country ?? "",
        email:    customerEmail,
      };

      const productUid = getCanvasProductUid(size);
      const orderRefId = `VP-${session.id.slice(-12)}`;

      console.log("[webhook] ▶ Creating Gelato order — uid:", productUid, "ref:", orderRefId);

      const gelatoOrder = await createGelatoOrder({
        orderReferenceId:   orderRefId,
        customerReferenceId: customerEmail || session.id,
        currency:   "USD",
        productUid,
        artworkUrl: hdImageUrl,
        shippingAddress: gelatoAddress,
      });

      const { error: gelatoSaveErr } = await supabase
        .from("orders")
        .update({ gelato_order_id: gelatoOrder.id })
        .eq("stripe_session_id", session.id);

      if (gelatoSaveErr) {
        console.error("[webhook] Could not save gelato_order_id:", gelatoSaveErr.message);
      } else {
        console.log("[webhook] ✓ Gelato order created:", gelatoOrder.id);
      }
    } catch (gelatoErr) {
      // Never rethrow here — Stripe MUST get a 200
      console.error("[webhook] Gelato order failed:", gelatoErr);
    }
  }

  // ── Step 6: Klaviyo confirmation email ─────────────────────────────────────
  if (customerEmail) {
    try {
      await notifyKlaviyo({
        email:           customerEmail,
        stripeSessionId: session.id,
        productType,
        size,
        hdImageUrl,
      });
    } catch (klaviyoErr) {
      console.error("[webhook] Klaviyo notification failed:", klaviyoErr);
    }
  }

  console.log("[webhook] ✓ All steps complete — session:", session.id);
  return NextResponse.json({ ok: true });
}

