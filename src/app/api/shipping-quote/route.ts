import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Supported countries with delivery estimates ───────────────────────────

type RateEntry = {
  standardDays: [number, number];
  expressDays: [number, number];
};

const RATES: Record<string, RateEntry> = {
  US: { standardDays: [5, 8], expressDays: [2, 4] },
  CA: { standardDays: [6, 10], expressDays: [3, 5] },
  GB: { standardDays: [6, 10], expressDays: [3, 5] },
  IE: { standardDays: [6, 10], expressDays: [3, 5] },
  ES: { standardDays: [6, 10], expressDays: [3, 5] },
  FR: { standardDays: [6, 10], expressDays: [3, 5] },
  DE: { standardDays: [6, 10], expressDays: [3, 5] },
  IT: { standardDays: [6, 10], expressDays: [3, 5] },
  AU: { standardDays: [8, 14], expressDays: [4, 7] },
  NZ: { standardDays: [8, 14], expressDays: [4, 7] },
  MX: { standardDays: [6, 10], expressDays: [3, 5] },
};

// ─── Endpoint ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { country: string };

    const country = body.country?.toUpperCase();
    if (!country) {
      return NextResponse.json(
        { error: "Missing required field: country." },
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

    return NextResponse.json({
      supported: true,
      standardDays: rateEntry.standardDays,
      expressDays: rateEntry.expressDays,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[shipping-quote]", message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
