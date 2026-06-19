import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Shipping rates per country (USD) ──────────────────────────────────────
// Gelato's v4 API doesn't expose a quote endpoint, so we use flat rates.
// Prices are for a single canvas print (12×16 – 24×36).

type RateEntry = {
  standard: number;
  express: number;
  /** Typical delivery windows (business days). */
  standardDays: [number, number];
  expressDays: [number, number];
};

const RATES: Record<string, RateEntry> = {
  US: { standard: 7.99, express: 15.99, standardDays: [5, 8], expressDays: [2, 4] },
  CA: { standard: 12.99, express: 24.99, standardDays: [6, 10], expressDays: [3, 5] },
  GB: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  IE: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  ES: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  FR: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  DE: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  IT: { standard: 14.99, express: 29.99, standardDays: [6, 10], expressDays: [3, 5] },
  AU: { standard: 16.99, express: 32.99, standardDays: [8, 14], expressDays: [4, 7] },
  NZ: { standard: 16.99, express: 32.99, standardDays: [8, 14], expressDays: [4, 7] },
  MX: { standard: 12.99, express: 24.99, standardDays: [6, 10], expressDays: [3, 5] },
};

// ─── Types ───────────────────────────────────────────────────────────────────

type Price = {
  amount: number;
  currency: string;
};

type DeliveryDays = {
  min: number;
  max: number;
};

type ShipmentMethod = {
  carrier: string;
  serviceName: string;
  totalPrice: Price;
  deliveryDays: DeliveryDays;
};

// ─── Endpoint ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { country: string; postcode: string };

    const country = body.country?.toUpperCase();
    if (!country || !body.postcode) {
      return NextResponse.json(
        { error: "Missing required fields: country, postcode." },
        { status: 400 },
      );
    }

    if (country.length !== 2) {
      return NextResponse.json(
        { error: "Country must be a 2-letter ISO code." },
        { status: 400 },
      );
    }

    const rateEntry = RATES[country];
    if (!rateEntry) {
      return NextResponse.json(
        { error: `Shipping is not available for ${country} yet.` },
        { status: 404 },
      );
    }

    const shipmentMethods: ShipmentMethod[] = [
      {
        carrier: "Standard",
        serviceName: "Standard Shipping",
        totalPrice: { amount: rateEntry.standard, currency: "USD" },
        deliveryDays: { min: rateEntry.standardDays[0], max: rateEntry.standardDays[1] },
      },
      {
        carrier: "Express",
        serviceName: "Express Shipping",
        totalPrice: { amount: rateEntry.express, currency: "USD" },
        deliveryDays: { min: rateEntry.expressDays[0], max: rateEntry.expressDays[1] },
      },
    ];

    return NextResponse.json({ shipmentMethods });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[shipping-quote]", message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
