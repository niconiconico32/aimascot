import { NextRequest, NextResponse } from "next/server";

import { sendTrackingNotification } from "@/lib/email";
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

    if (currentStatus === "shipped" && trackingCode && order.customer_email) {
      try {
        await sendTrackingNotification({
          customerEmail: order.customer_email,
          productLabel: isMug ? "mug" : "canvas",
          trackingCode,
          trackingUrl,
          sessionId: order.stripe_session_id,
        });
      } catch (emailErr) {
        console.error("[gelato-webhook] Tracking email failed:", emailErr);
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
