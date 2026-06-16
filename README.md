# Crowned Portraits (aimascot)

AI-powered portrait generation e-commerce platform. Users upload a photo, choose a style, and receive an AI-generated portrait — either as a digital download or printed on canvas.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| AI Generation | fal.ai (`nano-banana-2/edit` + `aura-sr` 4× upscale) |
| Payments | Stripe Checkout Sessions + Webhooks |
| Database | Supabase (Postgres) |
| Storage | Supabase Storage (uploaded photos, previews, deliverables) |
| Fulfillment | Gelato print-on-demand API |
| Image Processing | sharp (watermarking) |

## Architecture

```
User → Wizard → /api/generate → fal.ai (style transfer)
                                    ↓
                              Watermarked preview
                                    ↓
                       Preview + Package Selection
                                    ↓
                              /api/create-checkout-session
                              or /api/checkout
                                    ↓
                            Stripe Checkout Session
                                    ↓
                         ↙                  ↘
              Payment succeeds          User cancels
                    ↓                       ↓
         Stripe Webhook fired          Redirect /cart
     (checkout.session.completed)
                    ↓
          ┌─────────────────┐
          │  Idempotency     │ ← Skip if already PAID/PROCESSING/COMPLETED
          └─────────────────┘
                    ↓
             Status → PROCESSING
                    ↓
        Fire-and-forget fulfillment
          ┌─────────────────┐
          │ 1. 4K Upscaling │ (fal-ai/aura-sr, 4× factor)
          │ 2. Digital:     │ Send download email via Resend (TO-DO)
          │    Canvas:      │ Create Gelato print order
          │ 3. Status       │ → COMPLETED
          └─────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts            # Stripe Checkout (full cart flow)
│   │   ├── checkout-session/route.ts    # Retrieve session details
│   │   ├── create-checkout-session/     # Simplified Stripe Checkout (price IDs from env)
│   │   ├── generate/route.ts            # AI portrait generation via fal.ai
│   │   ├── leads/route.ts               # Email lead capture
│   │   ├── orders/
│   │   │   ├── confirm/route.ts         # Manual order confirmation
│   │   │   └── update/route.ts          # Patch upscaled_url / gelato_order_id
│   │   └── webhooks/stripe/route.ts     # Payment webhook + fulfillment orchestrator
│   ├── cart/page.tsx                    # Cart + checkout form
│   ├── components/
│   │   ├── faq-accordion.tsx
│   │   ├── portrait-uploader.tsx        # Legacy uploader
│   │   ├── portrait-wizard.tsx          # Main 3-step wizard (subject → style → upload)
│   │   └── video-reaction-carousel.tsx
│   ├── contact/page.tsx                 # Contact form
│   ├── preview/page.tsx                 # Portrait preview + package selection
│   ├── privacy/page.tsx                 # Privacy policy (static)
│   ├── success/page.tsx                 # Post-payment confirmation
│   ├── terms/page.tsx                   # Terms of service (static)
│   ├── page.tsx                         # Home / landing page
│   ├── layout.tsx                       # Root layout (fonts, metadata)
│   └── globals.css                      # Tailwind + design system
├── data/
│   └── styles.ts                        # Subject/style definitions + fal prompts
└── lib/
    ├── gelato.ts                        # Gelato print-on-demand client
    ├── stripe.ts                        # Stripe server singleton
    └── supabase-server.ts               # Supabase server client
```

## Getting Started

### Prerequisites

- Node.js 20+
- Stripe account (test mode)
- fal.ai account (with `FAL_KEY`)
- Supabase project (Postgres + Storage)
- Gelato account (for canvas fulfillment)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# fal.ai
FAL_KEY=fal_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_DIGITAL=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_CANVAS=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_MUG=price_xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxx

# Gelato (for canvas orders)
GELATO_API_KEY=xxx
GELATO_DRAFT_MODE=true
GELATO_CANVAS_UID_8X10=canvas_200x250-mm_canvas_...
GELATO_CANVAS_UID_12X16=canvas_300x400-mm_canvas_...
GELATO_CANVAS_UID_18X24=canvas_450x600-mm_canvas_...
GELATO_CANVAS_UID_24X36=canvas_600x900-mm_canvas_...
```

### Install & Run

```bash
npm install
npm run dev
# → http://localhost:3000
```

## API Reference

### `POST /api/create-checkout-session`

Simplified checkout. Creates a Stripe Checkout Session using pre-configured price IDs from env vars.

**Request:**
```json
{
  "email": "customer@example.com",
  "baseProduct": "digital" | "canvas",
  "generatedImageUrl": "https://xxx.supabase.co/...",
  "wantsMug": false
}
```

**Response:** `{ "url": "https://checkout.stripe.com/..." }`

**Behavior:**
- Reads `NEXT_PUBLIC_STRIPE_PRICE_DIGITAL` or `NEXT_PUBLIC_STRIPE_PRICE_CANVAS` + optionally `NEXT_PUBLIC_STRIPE_PRICE_MUG`
- Collects shipping address if `baseProduct === "canvas"` or `wantsMug === true`
- Metadata: `{ baseProduct, wantsMug, generatedImageUrl }` (used by webhook)

### `POST /api/checkout`

Full-featured checkout with cart flow, upsells, gift wrap, and dynamic pricing.

**Request** (simplified flow):
```json
{
  "priceId": "price_xxx",
  "productType": "canvas" | "digital_download",
  "size": "12 x 16",
  "generatedImageUrl": "https://..."
}
```

Also supports full cart flow with `{ packageKey, packageTitle, basePrice, upsells, ... }`.

### `GET /api/checkout-session?session_id=cs_xxx`

Retrieves order details for the success page.

**Response:** `{ customerEmail, imageUrl, productType }`

### `POST /api/generate`

AI portrait generation. Uploads a photo + style prompt, returns a watermarked preview.

**Request:** `{ fileName, stylePrompt }` (with session cookie for rate limiting)

**Response:** `{ imageData (watermarked preview URL), cleanImageUrl, remainingAttempts }`

### `POST /api/webhooks/stripe`

Stripe webhook endpoint. Only processes `checkout.session.completed` events.

**Fulfillment pipeline:**
1. ✓ Signature verification
2. ✓ Idempotency check (skips if already PAID/PROCESSING/COMPLETED)
3. ✓ Status → PROCESSING
4. ✓ Fire-and-forget: 4K upscale (fal.ai) → Gelato order (canvas) or email (digital) → COMPLETED

### `POST /api/leads`

Captures email leads from the wizard. Upserts into `portrait_leads` table.

### `POST /api/orders/confirm`

Manual order confirmation fallback. Updates order status from Stripe session.

### `POST /api/orders/update`

Internal route (bearer-protected) to patch `upscaled_url` and `gelato_order_id` on existing orders.

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Client | Landing page with wizard, testimonials, FAQ |
| `/preview` | Client | Portrait preview, regeneration, package selection |
| `/cart` | Client | Cart form with upsells, notes, Stripe redirect |
| `/success?session_id=xxx` | Server | Post-payment confirmation, LTV upsell |
| `/contact` | Client | Support form |
| `/privacy` | Server | Privacy policy |
| `/terms` | Server | Terms of service |

## Stripe Webhook (Production Setup)

1. Go to Stripe Dashboard → **Developers → Webhooks**
2. Click **Add endpoint**
3. **URL:** `https://tudominio.com/api/webhooks/stripe`
4. **Events:** Select `checkout.session.completed`
5. Copy the **Signing secret** (`whsec_xxx`) → add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Local testing

```bash
# Terminal 1: Start app
npm run dev

# Terminal 2: Forward Stripe events to local webhook
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

## Enabling Real AI Generation

In `src/app/components/portrait-wizard.tsx`:

```typescript
const TEST_MODE = false; // ← flip from true to false
```

See `ENABLE-API.md` for details.

## Supabase Schema

### `orders` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `stripe_session_id` | text | Stripe Checkout session ID |
| `customer_email` | text | Customer email |
| `product_type` | text | `digital` / `canvas` / `digital_download` / `canvas-digital` |
| `size_selected` | text | Canvas size (null for digital) |
| `artwork_url` | text | Original generated image URL |
| `upscaled_url` | text | 4K upscaled image URL |
| `gelato_order_id` | text | Gelato fulfillment order ID |
| `shipping_address` | jsonb | Shipping address object |
| `status` | text | `pending_payment` → `PROCESSING` → `COMPLETED` |
| `created_at` | timestamptz | Default: `now()` |

### `portrait_leads` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `email` | text | Lead email |
| `subject` | text | Selected subject |
| `style` | text | Selected style |
| `personalize_text` | text | Optional personalization |
| `source` | text | Always `"wizard"` |
| `created_at` | timestamptz | Default: `now()` |
| *Unique constraint:* | | `email + subject + style` |

### Storage buckets

| Bucket | Visibility | Purpose |
|--------|-----------|---------|
| `uploaded_photos` | Private | Raw user uploads before processing |
| `previews` | Public | Watermarked preview images |
| `deliverables` | Private | Clean full-resolution images |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

## LTV Upsell

After purchase, the success page displays a banner:
- **Code:** `FAMILY50` — 50% off next portrait
- **Link:** `/?promo=FAMILY50`
