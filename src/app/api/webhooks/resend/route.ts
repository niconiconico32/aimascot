import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

type ResendTag = { name: string; value: string };

type ResendEventData = {
  id: string;
  to: string[];
  from: string;
  subject: string;
  tags: ResendTag[];
  created_at: string;
};

type ResendWebhookPayload = {
  type: string;
  created_at: string;
  data: ResendEventData;
};

function verifyResendSignature(
  rawBody: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string,
): boolean {
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(signedContent)
    .digest();

  const sigHeader = svixSignature.split(" ").map((s) => s.trim());
  for (const part of sigHeader) {
    if (!part.startsWith("v1,")) continue;
    const receivedSig = Buffer.from(part.slice(3), "base64");
    if (
      receivedSig.length === expectedSignature.length &&
      timingSafeEqual(receivedSig, expectedSignature)
    ) {
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing Svix headers." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  if (!verifyResendSignature(rawBody, svixId, svixTimestamp, svixSignature, secret)) {
    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 401 },
    );
  }

  let payload: ResendWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as ResendWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const sessionId = payload.data.tags?.find(
    (t) => t.name === "stripe_session_id",
  )?.value;

  if (!sessionId) {
    console.warn(
      "[resend-webhook] No stripe_session_id tag — skipping:",
      payload.data.id,
    );
    return NextResponse.json({ received: true });
  }

  const supabase = getSupabaseServerClient();

  try {
    switch (payload.type) {
      case "email.delivered":
        await supabase
          .from("orders")
          .update({
            email_status: "delivered",
            email_delivered_at: payload.created_at,
          })
          .eq("stripe_session_id", sessionId);
        console.log(
          "[resend-webhook] ✓ Delivered — session:",
          sessionId,
        );
        break;

      case "email.bounced":
        await supabase
          .from("orders")
          .update({
            email_status: "bounced",
            email_bounced_at: payload.created_at,
          })
          .eq("stripe_session_id", sessionId);
        console.warn(
          "[resend-webhook] ✗ Bounced — session:",
          sessionId,
        );
        break;

      case "email.complained":
        await supabase
          .from("orders")
          .update({ email_status: "complained" })
          .eq("stripe_session_id", sessionId);
        console.warn(
          "[resend-webhook] ✗ Spam complaint — session:",
          sessionId,
        );
        break;

      case "email.opened":
        await supabase
          .from("orders")
          .update({ email_opened_at: payload.created_at })
          .eq("stripe_session_id", sessionId);
        console.log(
          "[resend-webhook] 👁 Opened — session:",
          sessionId,
        );
        break;

      default:
        console.log(
          "[resend-webhook] Ignored event:",
          payload.type,
          "— id:",
          payload.data.id,
        );
    }
  } catch (dbErr) {
    console.error("[resend-webhook] DB update failed:", dbErr);
  }

  return NextResponse.json({ received: true });
}
