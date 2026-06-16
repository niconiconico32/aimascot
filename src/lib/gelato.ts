/**
 * Gelato print-on-demand API client (v4)
 * Base URL: https://order.gelatoapis.com
 * Auth: X-API-KEY header (set GELATO_API_KEY in environment)
 *
 * Canvas product UIDs must be configured via environment variables.
 * To find the correct UIDs for your Gelato account:
 *   1. Log in to dashboard.gelato.com
 *   2. Browse the canvas catalog at:
 *      POST https://product.gelatoapis.com/v3/catalogs/canvas/products:search
 *   3. Copy the productUid values and set them in .env.local
 */

const GELATO_BASE_URL = "https://order.gelatoapis.com";

/**
 * Map from cart size strings (e.g. "8 x 10") to Gelato canvas product UIDs.
 * Override any entry via the corresponding GELATO_CANVAS_UID_* environment variable.
 *
 * Placeholder UIDs below will be rejected by Gelato — replace with real ones
 * from your catalog before going live.
 */
const CANVAS_PRODUCT_UIDS: Record<string, string> = {
  "8 x 8": process.env.GELATO_CANVAS_UID_8X8 ?? "REPLACE_WITH_GELATO_UID_8X8",
  "8 x 10": process.env.GELATO_CANVAS_UID_8X10 ?? "REPLACE_WITH_GELATO_UID_8X10",
  "12 x 16": process.env.GELATO_CANVAS_UID_12X16 ?? "REPLACE_WITH_GELATO_UID_12X16",
  "18 x 24": process.env.GELATO_CANVAS_UID_18X24 ?? "REPLACE_WITH_GELATO_UID_18X24",
  "24 x 36": process.env.GELATO_CANVAS_UID_24X36 ?? "REPLACE_WITH_GELATO_UID_24X36",
  "11 x 14": process.env.GELATO_CANVAS_UID_11X14 ?? "REPLACE_WITH_GELATO_UID_11X14",
  "16 x 20": process.env.GELATO_CANVAS_UID_16X20 ?? "REPLACE_WITH_GELATO_UID_16X20",
  "20 x 24": process.env.GELATO_CANVAS_UID_20X24 ?? "REPLACE_WITH_GELATO_UID_20X24",
};

/** Returns the Gelato productUid for a given size string, falling back to 8×10. */
export function getCanvasProductUid(size: string): string {
  const normalizedSize = size.replace(/\s+/g, "").toLowerCase();
  const matchedSize = Object.keys(CANVAS_PRODUCT_UIDS).find(
    (candidate) => candidate.replace(/\s+/g, "").toLowerCase() === normalizedSize,
  );

  return CANVAS_PRODUCT_UIDS[matchedSize ?? size] ?? CANVAS_PRODUCT_UIDS["8 x 10"] ?? "REPLACE_WITH_GELATO_UID_8X10";
}

/** Returns the Gelato productUid for the mug, reading MUG_PRODUCT_UID from env. */
export function getMugProductUid(): string {
  const uid = (process.env.MUG_PRODUCT_UID ?? "").trim();
  if (!uid) {
    throw new Error("MUG_PRODUCT_UID environment variable is not set.");
  }
  return uid;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GelatoShippingAddress = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postCode: string;
  country: string;
  email: string;
  phone?: string;
};

export type GelatoOrderParams = {
  /** Your internal order reference (e.g. "VP-{stripe_session_id}"). */
  orderReferenceId: string;
  /** Your internal customer reference (e.g. customer email). */
  customerReferenceId: string;
  /** ISO 4217 currency code. */
  currency: string;
  /** Gelato productUid for the canvas product. */
  productUid: string;
  /** Publicly accessible URL for the artwork file (JPEG / PNG / PDF). */
  artworkUrl: string;
  quantity?: number;
  shippingAddress: GelatoShippingAddress;
};

export type GelatoOrderResponse = {
  id: string;
  orderReferenceId: string;
  fulfillmentStatus: string;
  financialStatus: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Splits a full name into firstName / lastName for the Gelato API.
 * Gelato's fields each have a 25-character max, so we truncate if needed.
 */
export function splitFullName(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const name = (fullName ?? "").trim();
  if (!name) return { firstName: "Customer", lastName: "-" };

  const parts = name.split(/\s+/);
  const firstName = (parts[0] ?? "Customer").slice(0, 25);
  const lastName = (parts.length > 1 ? parts.slice(1).join(" ") : "-").slice(0, 25);
  return { firstName, lastName };
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

/**
 * Creates a Gelato print-on-demand order.
 * Throws if GELATO_API_KEY is missing or if the API returns an error.
 */
export async function createGelatoOrder(
  params: GelatoOrderParams
): Promise<GelatoOrderResponse> {
  const apiKey = (process.env.GELATO_API_KEY ?? "").trim();
  if (!apiKey) {
    throw new Error("GELATO_API_KEY environment variable is not set.");
  }

  const isDraft = process.env.GELATO_DRAFT_MODE === "true";

  const body = {
    orderType: isDraft ? "draft" : "order",
    orderReferenceId: params.orderReferenceId,
    customerReferenceId: params.customerReferenceId,
    currency: params.currency,
    items: [
      {
        itemReferenceId: `${params.orderReferenceId}-portrait`,
        productUid: params.productUid,
        quantity: params.quantity ?? 1,
        files: [
          {
            type: "default",
            url: params.artworkUrl,
          },
        ],
      },
    ],
    shippingAddress: params.shippingAddress,
  };

  const response = await fetch(`${GELATO_BASE_URL}/v4/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gelato API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<GelatoOrderResponse>;
}
