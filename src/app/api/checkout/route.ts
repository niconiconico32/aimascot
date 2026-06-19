import { NextRequest, NextResponse } from "next/server";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// ─── Simplified payload: sent from the preview page (uses a pre-configured
//     Stripe price ID instead of dynamic price_data) ───────────────────────
type SimplifiedCheckoutPayload = {
  priceId: string;
  productType: "canvas" | "digital_download";
  size: string;
  generatedImageUrl: string; // clean Fal URL — never exposed to the browser
};

type CheckoutUpsell = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type CheckoutPayload = {
  packageKey: "canvas-digital" | "digital";
  packageTitle: string;
  basePrice: number;
  size: string;
  artworkUrl: string;
  generatedImageUrl?: string; // optional: clean URL forwarded to Stripe metadata
  shippingFee: number;
  giftWrap: boolean;
  smsUpdates: boolean;
  shippingMethod?: string;
  email: string;
  cancelPath: string;
  upsells: CheckoutUpsell[];
  promotionCodeId?: string; // Stripe promotion_code ID from validated promo code
};

function toCents(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: NextRequest) {
  try {
    const rawPayload = await request.json();
    const stripe  = getStripeServerClient();
    const supabase = getSupabaseServerClient();
    const origin   = request.nextUrl.origin;

    // ── Simplified flow: preview page sends { priceId, productType, size, generatedImageUrl }
    if ("priceId" in rawPayload) {
      const { priceId, productType, size, generatedImageUrl } =
        rawPayload as SimplifiedCheckoutPayload;

      if (!priceId || !productType || !generatedImageUrl) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/preview`,
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        ...(productType === "canvas" && {
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "IE", "ES", "FR", "DE", "IT", "AU", "NZ"],
          },
        }),
      metadata: {
          productType,
          size,
          generatedImageUrl, // stored in Stripe — webhook uses this to trigger Gelato / upscale
        },
      });

      if (!session.url) {
        return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
      }

      await supabase.from("orders").insert({
        stripe_session_id: session.id,
        product_type: productType,
        size_selected: productType === "canvas" ? size : null,
        artwork_url: generatedImageUrl,
        status: "pending_payment",
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    // ── Full cart flow: existing comprehensive payload ────────────────────────
    const payload = rawPayload as CheckoutPayload;

    if (
      !payload.packageTitle ||
      !payload.artworkUrl ||
      !Number.isFinite(payload.basePrice) ||
      payload.basePrice <= 0
    ) {
      return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
    }

    const cancelPath = payload.cancelPath?.startsWith("/") ? payload.cancelPath : "/cart";

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: toCents(payload.basePrice),
          product_data: {
            name: payload.packageTitle,
            description:
              payload.packageKey === "digital"
                ? "Digital portrait delivery"
                : `Canvas portrait, size ${payload.size}`,
          },
        },
        quantity: 1,
      },
      ...(payload.giftWrap
        ? [
            {
              price_data: {
                currency: "usd",
                unit_amount: 900,
                product_data: {
                  name: "Gift wrap add-on",
                  description: "Gift-ready wrap and handwritten-style note",
                },
              },
              quantity: 1,
            },
          ]
        : []),
      ...(payload.shippingFee > 0
        ? [
            {
              price_data: {
                currency: "usd",
                unit_amount: toCents(payload.shippingFee),
                product_data: {
                  name: "Shipping",
                  description: "Tracked delivery",
                },
              },
              quantity: 1,
            },
          ]
        : []),
      ...payload.upsells
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          price_data: {
            currency: "usd",
            unit_amount: toCents(item.unitPrice),
            product_data: {
              name: item.name,
              description: "Portrait-themed upsell product",
            },
          },
          quantity: item.quantity,
        })),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
      customer_email: payload.email || undefined,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      shipping_address_collection:
        payload.packageKey === "digital"
          ? undefined
          : {
              allowed_countries: ["US", "CA", "MX", "ES", "GB", "FR", "DE", "IT", "AU", "NZ"],
            },
      line_items: lineItems,
      ...(payload.promotionCodeId
        ? { discounts: [{ promotion_code: payload.promotionCodeId }] }
        : {}),
      metadata: {
        packageKey: payload.packageKey,
        packageTitle: payload.packageTitle,
        size: payload.size,
        smsUpdates: String(payload.smsUpdates),
        shippingMethod: payload.shippingMethod ?? "standard",
        // Include clean image URL so the webhook can trigger printing / upscaling
        ...(payload.generatedImageUrl && { generatedImageUrl: payload.generatedImageUrl }),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    const { error } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer_email: payload.email,
      product_type: payload.packageKey,
      size_selected: payload.packageKey === "digital" ? null : payload.size,
      artwork_url: payload.artworkUrl,
      status: "pending_payment",
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Unknown checkout error.";
    console.error("[checkout]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}