import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      event?: string;
      orderId?: string;
      orderReferenceId?: string;
      trackingCode?: string;
      trackingUrl?: string;
      status?: string;
    };

    if (body.event !== "order_status_updated" && body.event !== "order_item_status_updated") {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const orderId = body.orderId;
    const orderReferenceId = body.orderReferenceId;
    const trackingCode = body.trackingCode;
    const trackingUrl = body.trackingUrl;
    const currentStatus = body.status;

    if (!orderId || !orderReferenceId) {
      console.warn("[gelato-webhook] Missing orderId or orderReferenceId");
      return NextResponse.json({ message: "Missing fields" }, { status: 200 });
    }

    console.log(
      "[gelato-webhook] Event received:",
      body.event,
      "| orderId:",
      orderId,
      "| status:",
      currentStatus,
    );

    const supabase = getSupabaseServerClient();

    const isMug = orderReferenceId.endsWith("-mug");
    const idColumn = isMug ? "mug_gelato_order_id" : "gelato_order_id";

    const { data: order } = await supabase
      .from("orders")
      .select("stripe_session_id, customer_email, status")
      .eq(idColumn, orderId)
      .maybeSingle();

    if (!order) {
      console.warn("[gelato-webhook] No order found for", idColumn, orderId);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    const now = new Date().toISOString();

    await supabase
      .from("orders")
      .update({
        gelato_status: currentStatus,
        tracking_code: trackingCode ?? null,
        tracking_url: trackingUrl ?? null,
        gelato_updated_at: now,
      })
      .eq("stripe_session_id", order.stripe_session_id);

    if (currentStatus === "shipped" && trackingCode) {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey && order.customer_email) {
        try {
          const resend = new Resend(apiKey);
          const productLabel = isMug ? "mug" : "canvas";

          await resend.emails.send({
            from: "Crowned Portraits <hello@crownedportraits.com>",
            replyTo: "hello@crownedportraits.com",
            to: [order.customer_email],
            subject: `📦 Your ${productLabel} order has shipped!`,
            html: `<!DOCTYPE html>
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
                📦 Your ${productLabel} is on the way!
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#5a5a5a;text-align:center;line-height:1.6;">
                Great news — your order has been shipped.
              </p>
              ${trackingCode ? `
              <div style="text-align:center;margin-bottom:12px;">
                <p style="margin:0 0 4px;font-size:13px;color:#8a8a8a;">Tracking number:</p>
                <p style="margin:0;font-size:18px;font-weight:700;color:#1e3a8a;">${trackingCode}</p>
              </div>
              ` : ""}
              ${trackingUrl ? `
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${trackingUrl}" style="display:inline-block;background:#1e3a8a;color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
                  Track your package
                </a>
              </div>
              ` : ""}

              <hr style="border:none;border-top:1px solid #e8e0d4;margin:24px 0;" />

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
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
</html>`,
            text: `📦 Your ${productLabel} has shipped!\n\nTracking: ${trackingCode ?? "N/A"}\n${trackingUrl ?? ""}\n\nContact us: https://www.crownedportraits.com/contact\n\n---\n🐾 Liked the result? Get 50% off your next portrait with code FAMILY50\nhttps://www.crownedportraits.com/?promo=FAMILY50\n\nCrowned Portraits — GGRetro LLC`,
          });
        } catch (emailErr) {
          console.error("[gelato-webhook] Tracking email failed:", emailErr);
        }
      }
    }

    console.log("[gelato-webhook] ✓ Order updated for", orderId);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[gelato-webhook]", message);
    return NextResponse.json({ received: true });
  }
}
