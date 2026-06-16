import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeServerClient } from "@/lib/stripe";

export const runtime = "nodejs";

const ALLOWED_SHIPPING_COUNTRIES = [
  "US", "CA", "GB", "IE", "ES", "FR", "DE", "IT", "AU", "NZ",
] as const;

function getBasePriceId(baseProduct: string): string {
  if (baseProduct === "canvas") {
    const id = process.env.STRIPE_PRICE_CANVAS;
    if (!id) {
      throw new Error("Missing STRIPE_PRICE_CANVAS environment variable.");
    }
    return id;
  }

  if (baseProduct === "digital") {
    const id = process.env.STRIPE_PRICE_DIGITAL;
    if (!id) {
      throw new Error("Missing STRIPE_PRICE_DIGITAL environment variable.");
    }
    return id;
  }

  throw new Error(`Invalid baseProduct: "${baseProduct}". Must be "digital" or "canvas".`);
}

function getMugPriceId(): string {
  const id = process.env.STRIPE_PRICE_MUG;
  if (!id) {
    throw new Error("Missing STRIPE_PRICE_MUG environment variable.");
  }
  return id;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      baseProduct?: string;
      generatedImageUrl?: string;
      wantsMug?: boolean;
    };

    const { email, baseProduct, generatedImageUrl, wantsMug } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing required field: email." }, { status: 400 });
    }

    if (!baseProduct) {
      return NextResponse.json({ error: "Missing required field: baseProduct." }, { status: 400 });
    }

    if (!generatedImageUrl) {
      return NextResponse.json({ error: "Missing required field: generatedImageUrl." }, { status: 400 });
    }

    const stripe = getStripeServerClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

    const line_items: { price: string; quantity: number }[] = [];

    line_items.push({ price: getBasePriceId(baseProduct), quantity: 1 });

    if (wantsMug) {
      line_items.push({ price: getMugPriceId(), quantity: 1 });
    }

    const needsShipping = baseProduct === "canvas" || wantsMug === true;

    type CreateParams = Stripe.Checkout.SessionCreateParams;

    const sessionParams: CreateParams = {
      mode: "payment",
      customer_email: email,
      line_items,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      billing_address_collection: "auto",
      ...(needsShipping && {
        shipping_address_collection: {
          allowed_countries: [...ALLOWED_SHIPPING_COUNTRIES],
        },
        phone_number_collection: { enabled: true },
      }),
      metadata: {
        baseProduct,
        wantsMug: String(wantsMug ?? false),
        generatedImageUrl,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const _message = error instanceof Error ? error.message : "Unknown error creating checkout session.";
    console.error("[create-checkout-session]", _message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
