/**
 * Gelato integration test script
 * Usage: node scripts/test-gelato.mjs
 *
 * Tests:
 *  1. Authentication — verifies GELATO_API_KEY works
 *  2. Product UID — confirms the 18x24 canvas UID is accepted by Gelato
 *  3. Draft order creation — creates a draft order (no real print triggered)
 *
 * Requires: .env.local populated with GELATO_API_KEY + GELATO_CANVAS_UID_18X24
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local manually (no dotenv dependency needed) ──────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");
const envLines = readFileSync(envPath, "utf-8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (key && val && !process.env[key]) {
    process.env[key] = val;
  }
}

// ── Config ──────────────────────────────────────────────────────────────────
const GELATO_BASE_URL = "https://order.gelatoapis.com";
const apiKey = (process.env.GELATO_API_KEY ?? "").trim();
const productUid =
  (process.env.GELATO_CANVAS_UID_18X24 ?? "").trim() ||
  "canvas_450x600-mm-18x24-inch_canvas_wood-fsc-slim_4-0_ver";

// Public test image — replace with a real artwork URL for a more realistic test
const TEST_ARTWORK_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg";

if (!apiKey) {
  console.error("❌  GELATO_API_KEY is not set in .env.local");
  process.exit(1);
}

console.log("\n🧪  Gelato integration test");
console.log("   API key :", apiKey.slice(0, 8) + "…");
console.log("   Product :", productUid);
console.log("   Mode    : DRAFT (no real print)\n");

// ── Test 1: Create draft order ───────────────────────────────────────────────
const orderRef = `TEST-${Date.now()}`;
const body = {
  orderType: "draft",
  orderReferenceId: orderRef,
  customerReferenceId: "test@crowlned-portraits.com",
  currency: "USD",
  items: [
    {
      itemReferenceId: `${orderRef}-portrait`,
      productUid,
      quantity: 1,
      files: [{ type: "default", url: TEST_ARTWORK_URL }],
    },
  ],
  shippingAddress: {
    firstName: "Test",
    lastName: "Customer",
    addressLine1: "451 Clarkson Ave",
    city: "New York",
    state: "NY",
    postCode: "11203",
    country: "US",
    email: "test@crowned-portraits.com",
  },
};

try {
  const res = await fetch(`${GELATO_BASE_URL}/v4/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌  Gelato API error", res.status);
    console.error("   ", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("✅  Draft order created successfully!");
  console.log("   Gelato order ID  :", data.id);
  console.log("   Reference ID     :", data.orderReferenceId);
  console.log("   Fulfillment status:", data.fulfillmentStatus);
  console.log("\n   → Check your Gelato dashboard to confirm the draft order appeared.");
  console.log("   → Delete it from the dashboard after verifying.\n");
} catch (err) {
  console.error("❌  Network or unexpected error:", err.message);
  process.exit(1);
}
