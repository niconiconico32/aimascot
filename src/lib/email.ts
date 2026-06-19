import { Resend } from "resend";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderConfirmationData = {
  sessionId: string;
  customerEmail: string;
  isCanvas: boolean;
  wantsMug: boolean;
  size: string;
  imageUrl: string;
};

type TrackingNotificationData = {
  customerEmail: string;
  productLabel: string;
  trackingCode?: string;
  trackingUrl?: string;
  sessionId: string;
};

// ─── Shared helpers ──────────────────────────────────────────────────────────

const BASE_URL = "https://www.crownedportraits.com";
const FONT_FAMILY = "Georgia, serif";
const BG_COLOR = "#f8f5ef";
const CARD_BG = "#ffffff";
const PRIMARY = "#1e3a8a";
const MUTED = "#b0b0b0";
const TEXT = "#5a5a5a";
const BORDER = "#e8e0d4";

function wrapper(html: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:${FONT_FAMILY};">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:${CARD_BG};border-radius:18px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
              ${html}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:${MUTED};">
                Crowned Portraits &bull; GGRetro LLC
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function hr(): string {
  return `<hr style="border:none;border-top:1px solid ${BORDER};margin:24px 0;" />`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 8px;font-size:28px;color:${PRIMARY};text-align:center;font-weight:800;">${text}</h1>`;
}

function sectionTitle(text: string): string {
  return `<h2 style="margin:0 0 12px;font-size:16px;color:${PRIMARY};font-weight:700;">${text}</h2>`;
}

function orderRefBadge(orderRef: string): string {
  return `<p style="margin:0 0 4px;font-size:13px;color:#8a8a8a;text-align:center;">
    Order reference:
    <strong style="color:${PRIMARY};">${orderRef}</strong>
  </p>`;
}

function imagePreview(url: string): string {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" target="_blank">
      <img src="${url}" alt="Your portrait" style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);" />
    </a>
  </div>`;
}

function downloadButton(url: string): string {
  return `<div style="text-align:center;margin:20px 0;">
    <a href="${url}" style="display:inline-block;background:${PRIMARY};color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
      Download your portrait
    </a>
    <p style="margin:8px 0 0;font-size:12px;color:${MUTED};">
      Link expires in 7 days
    </p>
  </div>`;
}

function progressTracker(isCanvas: boolean, wantsMug: boolean): string {
  const step = (label: string, state: "done" | "current" | "pending") => {
    const dot = state === "done" ? "✓" : state === "current" ? "◉" : "○";
    const color = state === "done" ? "#1e8a3e" : state === "current" ? PRIMARY : MUTED;
    const weight = state === "current" ? "700" : "400";
    return `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;color:${color};font-size:14px;font-weight:${weight};">
      <span style="width:20px;text-align:center;font-size:16px;">${dot}</span>
      <span>${label}</span>
    </div>`;
  };

  const printLabel =
    isCanvas && wantsMug
      ? "Printing canvas & mug"
      : isCanvas
        ? "Printing canvas"
        : "Printing mug";

  return `
    ${step("Order received", "done")}
    ${step("Preparing artwork", "current")}
    ${step(printLabel, "pending")}
    ${step("Shipped", "pending")}
    ${step("Delivered", "pending")}`;
}

function orderItemsList(isCanvas: boolean, wantsMug: boolean, size: string): { html: string; text: string } {
  const items: string[] = ["Digital Download"];
  if (isCanvas) items.push(`Canvas Print ${size}`);
  if (wantsMug) items.push("Coffee Mug");
  return {
    html: items.map((i) => `<li style="padding:4px 0;font-size:14px;color:#333;">✓ ${i}</li>`).join(""),
    text: items.map((i) => `• ${i}`).join("\n"),
  };
}

function upsellBanner(): string {
  return `<div style="background:#fef6e6;border-radius:12px;padding:20px 24px;text-align:center;border:1px solid #f0dbaa;">
    <p style="margin:0 0 6px;font-size:16px;color:#6b4e00;font-weight:700;">
      🐾 Liked the result?
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#6b4e00;line-height:1.5;">
      Get <strong>50% off</strong> your next portrait with code
      <strong style="font-size:18px;letter-spacing:2px;">FAMILY50</strong>
    </p>
    <a href="${BASE_URL}/?promo=FAMILY50" style="display:inline-block;background:${PRIMARY};color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
      Make a new portrait →
    </a>
  </div>`;
}

function navLinks(showTrack: boolean, trackUrl: string): string {
  const links = [
    showTrack ? `<a href="${trackUrl}" style="display:inline-block;color:${PRIMARY};font-size:14px;font-weight:600;text-decoration:underline;margin:0 12px;">Track Order</a>` : "",
    `<a href="${BASE_URL}/contact" style="display:inline-block;color:${PRIMARY};font-size:14px;font-weight:600;text-decoration:underline;margin:0 12px;">Contact Support</a>`,
  ];
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom:12px;">
    ${links.filter(Boolean).join("")}
  </td></tr></table>`;
}

function trackingInfo(email: string): string {
  return `<p style="margin:0 0 4px;font-size:13px;color:${TEXT};text-align:center;">
    Tracking updates will be sent to:
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:${PRIMARY};font-weight:600;text-align:center;">
    ${email}
  </p>`;
}

// ─── Order confirmation (Stripe webhook) ──────────────────────────────────────

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured — skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const orderRef = `VP-${data.sessionId.slice(-8).toUpperCase()}`;
  const isPhysical = data.isCanvas || data.wantsMug;
  const { html: itemsHtml, text: itemsText } = orderItemsList(data.isCanvas, data.wantsMug, data.size);
  const trackUrl = `${BASE_URL}/success?session_id=${data.sessionId}`;
  const imageUrl = data.imageUrl;

  // ── HTML ──────────────────────────────────────────────────────────────────
  const htmlBody = `
    ${heading(isPhysical ? "🎉 Your portrait is being created" : "🎉 Your portrait is ready!")}
    ${imageUrl ? imagePreview(imageUrl) : ""}
    ${orderRefBadge(orderRef)}
    ${hr()}
    ${sectionTitle("Order summary")}
    <ul style="list-style:none;margin:0;padding:0;">${itemsHtml}</ul>
    ${hr()}
    ${imageUrl ? downloadButton(imageUrl) : ""}
    ${isPhysical ? `
      ${hr()}
      ${sectionTitle("Progress")}
      ${progressTracker(data.isCanvas, data.wantsMug)}
      ${hr()}
      ${trackingInfo(data.customerEmail)}
    ` : ""}
    ${hr()}
    ${navLinks(isPhysical, trackUrl)}
    ${hr()}
    ${upsellBanner()}
  `;

  // ── Plain text ────────────────────────────────────────────────────────────
  const textParts: string[] = [
    `${isPhysical ? "🎉 Your portrait is being created!" : "🎉 Your portrait is ready!"}`,
    "",
    `Order reference: ${orderRef}`,
    "",
    "Order summary:",
    itemsText,
    "",
    `Download: ${imageUrl || "(link coming soon)"}`,
    "(Link expires in 7 days)",
  ];

  if (isPhysical) {
    textParts.push(
      "",
      "Progress:",
      "✓ Order received",
      "◉ Preparing artwork",
      `○ ${data.isCanvas && data.wantsMug ? "Printing canvas & mug" : data.isCanvas ? "Printing canvas" : "Printing mug"}`,
      "○ Shipped",
      "○ Delivered",
      "",
      `Tracking updates will be sent to: ${data.customerEmail}`,
      "",
      `Track your order: ${trackUrl}`,
    );
  }

  textParts.push(
    "",
    "Contact us: https://www.crownedportraits.com/contact",
    "",
    "---",
    "🐾 Liked the result? Get 50% off your next portrait with code FAMILY50",
    "Create another: https://www.crownedportraits.com/?promo=FAMILY50",
    "",
    "Crowned Portraits — GGRetro LLC",
  );

  const { error } = await resend.emails.send({
    from: "Crowned Portraits <hello@crownedportraits.com>",
    replyTo: "contact-liada@gmail.com",
    to: [data.customerEmail],
    subject: isPhysical
      ? "🎉 Your portrait is being created!"
      : "🎉 Your portrait is ready to download!",
    html: wrapper(htmlBody),
    text: textParts.join("\n"),
    tags: [
      { name: "stripe_session_id", value: data.sessionId },
      { name: "order_ref", value: orderRef },
      { name: "env", value: process.env.VERCEL_ENV ?? "development" },
    ],
  });

  if (error) {
    console.error("[email] Resend send failed:", error);
    throw error;
  }

  console.log("[email] ✓ Confirmation sent →", data.customerEmail);
}

// ─── Tracking notification (Gelato webhook) ───────────────────────────────────

export async function sendTrackingNotification(data: TrackingNotificationData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured — skipping tracking email");
    return;
  }

  const resend = new Resend(apiKey);
  const trackUrl = `${BASE_URL}/success?session_id=${data.sessionId}`;

  const htmlBody = `
    ${heading(`📦 Your ${data.productLabel} is on the way!`)}
    <p style="margin:0 0 24px;font-size:15px;color:${TEXT};text-align:center;line-height:1.6;">
      Great news — your order has been shipped.
    </p>
    ${data.trackingCode ? `
    <div style="text-align:center;margin-bottom:12px;">
      <p style="margin:0 0 4px;font-size:13px;color:#8a8a8a;">Tracking number:</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:${PRIMARY};">${data.trackingCode}</p>
    </div>
    ` : ""}
    ${data.trackingUrl ? `
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${data.trackingUrl}" style="display:inline-block;background:${PRIMARY};color:#ffffff;font-size:16px;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;">
        Track your package
      </a>
    </div>
    ` : ""}
    ${hr()}
    ${navLinks(false, trackUrl)}
    ${hr()}
    ${upsellBanner()}
  `;

  const textParts: string[] = [
    `📦 Your ${data.productLabel} has shipped!`,
    "",
    data.trackingCode ? `Tracking: ${data.trackingCode}` : "",
    data.trackingUrl ? data.trackingUrl : "",
    "",
    "Contact us: https://www.crownedportraits.com/contact",
    "",
    "---",
    "🐾 Liked the result? Get 50% off your next portrait with code FAMILY50",
    "Create another: https://www.crownedportraits.com/?promo=FAMILY50",
    "",
    "Crowned Portraits — GGRetro LLC",
  ];

  const { error } = await resend.emails.send({
    from: "Crowned Portraits <hello@crownedportraits.com>",
    replyTo: "contact-liada@gmail.com",
    to: [data.customerEmail],
    subject: `📦 Your ${data.productLabel} order has shipped!`,
    html: wrapper(htmlBody),
    text: textParts.filter(Boolean).join("\n"),
    tags: [
      { name: "env", value: process.env.VERCEL_ENV ?? "development" },
    ],
  });

  if (error) {
    console.error("[email] Tracking notification failed:", error);
    throw error;
  }

  console.log("[email] ✓ Tracking sent →", data.customerEmail);
}
