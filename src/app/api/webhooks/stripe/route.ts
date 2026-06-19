import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

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

  // ── Step 2: Send download email via Resend (all orders) ─────────────────────
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[webhook] RESEND_API_KEY not configured — skipping email");
    } else if (!data.customerEmail) {
      console.warn("[webhook] No customer email — skipping digital delivery");
    } else {
      const resend = new Resend(apiKey);
      const orderRef = `VP-${data.sessionId.slice(-8).toUpperCase()}`;
      const isPhysical = data.isCanvas || data.wantsMug;

      // ── Order items summary ──────────────────────────────────────────────
      const items: string[] = ["Digital Download"];
      if (data.isCanvas) items.push(`Canvas Print ${data.size}`);
      if (data.wantsMug) items.push("Coffee Mug");
      const itemsHtml = items.map((i) => `<li style="padding:4px 0;font-size:14px;color:#333;">✓ ${i}</li>`).join("");
      const itemsText = items.map((i) => `• ${i}`).join("\n");

      // ── Progress steps (physical only) ────────────────────────────────────
      const step = (label: string, state: "done" | "current" | "pending") => {
        const dot = state === "done" ? "✓" : state === "current" ? "◉" : "○";
        const color = state === "done" ? "#1e8a3e" : state === "current" ? "#1e3a8a" : "#b0b0b0";
        const weight = state === "current" ? "700" : "400";
        return `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;color:${color};font-size:14px;font-weight:${weight};">
          <span style="width:20px;text-align:center;font-size:16px;">${dot}</span>
          <span>${label}</span>
        </div>`;
      };

      let progressHtml = "";
      if (isPhysical) {
        const printLabel =
          data.isCanvas && data.wantsMug
            ? "Printing canvas & mug"
            : data.isCanvas
              ? "Printing canvas"
              : "Printing mug";
        progressHtml = `
          ${step("Order received", "done")}
          ${step("Preparing artwork", "current")}
          ${step(printLabel, "pending")}
          ${step("Shipped", "pending")}
          ${step("Delivered", "pending")}`;
      }

      const trackUrl = `https://www.crownedportraits.com/success?session_id=${data.sessionId}`;

      // ── Email HTML ───────────────────────────────────────────────────────
      const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f5ef;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:#ffffff;border-radius:18px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              <h1 style="margin:0 0 8px;font-size:28px;color:#1e3a8a;text-align:center;font-weight:800;">
                ${isPhysical ? "🎉 Your portrait is being created" : "🎉 Your portrait is ready!"}
              </h1>

              ${finalImageUrl ? `
              <div style="text-align:center;margin:24px 0;">
                <a href="${finalImageUrl}" target="_blank">
                  <img src="${finalImageUrl}" alt="Your portrait" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);" />
                </a>
              </div>
              ` : ""}

              <p style="margin:0 0 4px;font-size:13px;color:#8a8a8a;text-align:center;">
                Order reference:
                <strong style="color:#1e3a8a;">${orderRef}</strong>
              </p>

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <h2 style="margin:0 0 12px;font-size:16px;color:#1e3a8a;font-weight:700;">
                Order summary
              </h2>
              <ul style="list-style:none;margin:0;padding:0;">
                ${itemsHtml}
              </ul>

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <div style="text-align:center;margin:20px 0;">
                <a href="${finalImageUrl || "#"}" style="display:inline-block;background:#1e3a8a;color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
                  Download your portrait
                </a>
                <p style="margin:8px 0 0;font-size:12px;color:#b0b0b0;">
                  Link expires in 7 days
                </p>
              </div>

              ${isPhysical ? `
              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <h2 style="margin:0 0 12px;font-size:16px;color:#1e3a8a;font-weight:700;">
                Progress
              </h2>
              ${progressHtml}

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <p style="margin:0 0 4px;font-size:13px;color:#5a5a5a;text-align:center;">
                Tracking updates will be sent to:
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#1e3a8a;font-weight:600;text-align:center;">
                ${data.customerEmail}
              </p>
              ` : ""}

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    ${isPhysical ? `<a href="${trackUrl}" style="display:inline-block;color:#1e3a8a;font-size:14px;font-weight:600;text-decoration:underline;margin:0 12px;">Track Order</a>` : ""}
                    <a href="https://www.crownedportraits.com/contact" style="display:inline-block;color:#1e3a8a;font-size:14px;font-weight:600;text-decoration:underline;margin:0 12px;">Contact Support</a>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <div style="background:#fef6e6;border-radius:12px;padding:20px 24px;text-align:center;border:1px solid #f0dbaa;">
                <p style="margin:0 0 6px;font-size:16px;color:#6b4e00;font-weight:700;">
                  🐾 Liked the result?
                </p>
                <p style="margin:0 0 16px;font-size:14px;color:#6b4e00;line-height:1.5;">
                  Get <strong>50% off</strong> your next portrait with code
                  <strong style="font-size:18px;letter-spacing:2px;">FAMILY50</strong>
                </p>
                <a href="https://www.crownedportraits.com/?promo=FAMILY50" style="display:inline-block;background:#1e3a8a;color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
                  Make a new portrait →
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#b0b0b0;">
                Crowned Portraits &bull; GGRetro LLC
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      // ── Plain text fallback ──────────────────────────────────────────────
      const emailText = `${isPhysical ? "🎉 Your portrait is being created!" : "🎉 Your portrait is ready!"}

Order reference: ${orderRef}

Order summary:
${itemsText}

Download: ${finalImageUrl || "(link coming soon)"}
(Link expires in 7 days)
${isPhysical ? `
Progress:
✓ Order received
◉ Preparing artwork
○ ${data.isCanvas && data.wantsMug ? "Printing canvas & mug" : data.isCanvas ? "Printing canvas" : "Printing mug"}
○ Shipped
○ Delivered

Tracking updates will be sent to: ${data.customerEmail}

Track your order: ${trackUrl}
` : ""}
Contact us: https://www.crownedportraits.com/contact

---
🐾 Liked the result? Get 50% off your next portrait with code FAMILY50
Create another: https://www.crownedportraits.com/?promo=FAMILY50

Crowned Portraits — GGRetro LLC`;

      const { error } = await resend.emails.send({
        from: "Crowned Portraits <hello@crownedportraits.com>",
        replyTo: "hello@crownedportraits.com",
        to: [data.customerEmail],
        subject: isPhysical
          ? "🎉 Your portrait is being created!"
          : "🎉 Your portrait is ready to download!",
        html: emailHtml,
        text: emailText,
        tags: [
          { name: "stripe_session_id", value: data.sessionId },
          { name: "order_ref", value: orderRef },
          { name: "env", value: process.env.VERCEL_ENV ?? "development" },
        ],
      });

      const now = new Date().toISOString();

      if (error) {
        console.error("[webhook] Resend send failed:", error);
        await supabase
          .from("orders")
          .update({ email_status: "failed", email_sent_at: now })
          .eq("stripe_session_id", data.sessionId)
          .then(() => {});
      } else {
        console.log("[webhook] ✓ Download email sent →", data.customerEmail);
        await supabase
          .from("orders")
          .update({ email_status: "sent", email_sent_at: now })
          .eq("stripe_session_id", data.sessionId)
          .then(() => {});
      }
    }
  } catch (emailErr) {
    console.error("[webhook] Email delivery failed (non-blocking):", emailErr);
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
