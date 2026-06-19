import { NextRequest, NextResponse } from "next/server";

import { getCanvasProductUid } from "@/lib/gelato";

export const runtime = "nodejs";

// ─── Types ───────────────────────────────────────────────────────────────────

type QuoteRequest = {
  country: string;
  state?: string;
  city?: string;
  postcode: string;
  productUid?: string;
  /** Alternative to productUid — resolves via getCanvasProductUid(). */
  size?: string;
};

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

type GelatoQuoteResponse = {
  shipmentMethods: ShipmentMethod[];
};

// ─── Endpoint ────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuoteRequest;

    if (!body.country || !body.postcode) {
      return NextResponse.json(
        { error: "Missing required fields: country, postcode." },
        { status: 400 },
      );
    }

    if (body.country.length !== 2) {
      return NextResponse.json(
        { error: "Country must be a 2-letter ISO code." },
        { status: 400 },
      );
    }

    const resolvedUid = body.productUid ?? (body.size ? getCanvasProductUid(body.size) : undefined);

    if (!resolvedUid) {
      return NextResponse.json(
        { error: "Could not resolve productUid. Provide productUid or size." },
        { status: 400 },
      );
    }

    const apiKey = (process.env.GELATO_API_KEY ?? "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GELATO_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const payload = {
      recipient: {
        country: body.country.toUpperCase(),
        ...(body.state ? { state: body.state } : {}),
        ...(body.city ? { city: body.city } : {}),
        postcode: body.postcode,
      },
      products: [
        {
          itemReferenceId: "main-canvas-item",
          productUid: resolvedUid,
          quantity: 1,
        },
      ],
    };

    const response = await fetch(
      "https://api.gelato.com/v1/orders/quote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[shipping-quote] Gelato error:", response.status, errorText);
      return NextResponse.json(
        { error: `Gelato API error (${response.status}).` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as GelatoQuoteResponse;

    if (!data.shipmentMethods || data.shipmentMethods.length === 0) {
      return NextResponse.json(
        { error: "No shipping methods available for this destination." },
        { status: 404 },
      );
    }

    return NextResponse.json({ shipmentMethods: data.shipmentMethods });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[shipping-quote]", message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
