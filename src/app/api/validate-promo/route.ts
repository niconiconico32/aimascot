import { NextRequest, NextResponse } from "next/server";

import { getStripeServerClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json() as { code?: string };

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a promo code." },
        { status: 400 },
      );
    }

    const stripe = getStripeServerClient();

    const promotionCodes = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length === 0) {
      return NextResponse.json({ valid: false, error: "Invalid or expired promo code." });
    }

    const promo = promotionCodes.data[0];
    const coupon = promo.promotion.coupon;

    if (!coupon || typeof coupon === "string") {
      return NextResponse.json({ valid: false, error: "Unexpected promotion code configuration." });
    }

    if (coupon.redeem_by && coupon.redeem_by * 1000 < Date.now()) {
      return NextResponse.json({ valid: false, error: "This promo code has expired." });
    }

    if (
      typeof coupon.max_redemptions === "number" &&
      typeof coupon.times_redeemed === "number" &&
      coupon.times_redeemed >= coupon.max_redemptions
    ) {
      return NextResponse.json({
        valid: false,
        error: "This promo code has reached its maximum uses.",
      });
    }

    return NextResponse.json({
      valid: true,
      promotionCodeId: promo.id,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        currency: coupon.currency,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[validate-promo]", message);
    return NextResponse.json(
      { valid: false, error: "Could not validate promo code. Please try again." },
      { status: 500 },
    );
  }
}
