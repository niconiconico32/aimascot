import { NextRequest, NextResponse } from "next/server";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

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
  shippingFee: number;
  giftWrap: boolean;
  smsUpdates: boolean;
  notes: string;
  email: string;
  cancelPath: string;
  upsells: CheckoutUpsell[];
};

function toCents(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CheckoutPayload;

    if (
      !payload.packageTitle ||
      !payload.artworkUrl ||
      !Number.isFinite(payload.basePrice) ||
      payload.basePrice <= 0
    ) {
      return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
    }

    const stripe = getStripeServerClient();
    const supabase = getSupabaseServerClient();
    const origin = request.nextUrl.origin;
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
      success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
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
      metadata: {
        packageKey: payload.packageKey,
        packageTitle: payload.packageTitle,
        size: payload.size,
        smsUpdates: String(payload.smsUpdates),
        notes: payload.notes.slice(0, 500),
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown checkout error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}