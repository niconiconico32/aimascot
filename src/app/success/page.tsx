import Image from "next/image";
import Link from "next/link";

import { getStripeServerClient } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

function resolveProductType(meta: Record<string, string>): "digital" | "canvas" | "mug" {
  const raw = (meta.baseProduct ?? meta.productType ?? meta.packageKey ?? "").toLowerCase();
  if (raw === "canvas" || raw === "canvas-digital") return "canvas";
  if (meta.wantsMug === "true") return "mug";
  return "digital";
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string"
      ? params.session_id
      : Array.isArray(params.session_id)
        ? params.session_id[0]
        : null;

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-[var(--surface)] px-4 py-8 text-[var(--on-surface)] sm:px-6 lg:py-14">
        <div className="mx-auto w-full max-w-[980px]">
          <section className="rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--error-container)]">
              <span className="text-2xl font-bold text-[var(--on-error-container)]">
                !
              </span>
            </div>
            <h1 className="font-[var(--font-playfair)] text-3xl font-extrabold">
              Missing session
            </h1>
            <p className="mt-2 text-[var(--on-surface-variant)]">
              We couldn&apos;t find your payment session. Please check your link
              or{" "}
              <Link href="/" className="text-[var(--primary)] underline">
                return home
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    );
  }

  let customerEmail = "";
  let imageUrl = "";
  let productType: "digital" | "canvas" | "mug" = "digital";
  let orderRef = "";
  let errorMessage: string | null = null;

  try {
    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details"],
    });

    const meta = (session.metadata ?? {}) as Record<string, string>;

    customerEmail =
      session.customer_details?.email ?? session.customer_email ?? "";
    productType = resolveProductType(meta);
    imageUrl = meta.generatedImageUrl ?? "";
    orderRef = `VP-${session.id.slice(-8).toUpperCase()}`;

    if (!imageUrl) {
      try {
        const supabase = getSupabaseServerClient();
        const { data: order } = await supabase
          .from("orders")
          .select("artwork_url")
          .eq("stripe_session_id", session.id)
          .maybeSingle();
        if (order?.artwork_url) {
          imageUrl = order.artwork_url;
        }
      } catch {
        /* ignore Supabase fallback failure */
      }
    }
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Failed to load your order.";
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[var(--surface)] px-4 py-8 text-[var(--on-surface)] sm:px-6 lg:py-14">
        <div className="mx-auto w-full max-w-[980px]">
          <section className="rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--error-container)]">
              <span className="text-2xl font-bold text-[var(--on-error-container)]">
                !
              </span>
            </div>
            <h1 className="font-[var(--font-playfair)] text-3xl font-extrabold">
              Something went wrong
            </h1>
            <p className="mt-2 text-[var(--on-surface-variant)]">
              {errorMessage}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--on-primary)] transition hover:brightness-110"
            >
              Go home
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 py-8 text-[var(--on-surface)] sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-[980px]">
        {/* ── Success header ── */}
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary-container)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-[var(--on-primary-container)]"
              >
                <path
                  d="M9 16.17L5.53 12.7a1 1 0 0 0-1.42 1.42l4.18 4.18a1 1 0 0 0 1.42 0L20.3 7.7a1 1 0 0 0-1.42-1.42L9 16.17z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--secondary)]">
                Payment confirmed
              </p>
              <h1 className="mt-1 font-[var(--font-playfair)] text-4xl font-extrabold leading-none sm:text-5xl">
                Your portrait is on its way!
              </h1>
            </div>
          </div>
        </section>

        {/* ── What happens next ── */}
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-[var(--font-playfair)] text-2xl font-bold">
            What happens next
          </h2>

          {productType === "digital" ? (
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--surface-container-low)] p-5">
              <span className="mt-0.5 shrink-0 text-2xl" role="img" aria-label="sparkle">
                ✨
              </span>
              <div>
                <p className="font-semibold">Preparing your download</p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  We&apos;re getting your portrait ready. You&apos;ll receive
                  the download link at{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    {customerEmail}
                  </span>{" "}
                  within 5–10 minutes.
                </p>
              </div>
            </div>
          ) : productType === "mug" ? (
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--surface-container-low)] p-5">
              <span className="mt-0.5 shrink-0 text-2xl" role="img" aria-label="mug">
                ☕
              </span>
              <div>
                <p className="font-semibold">Your mug is being printed</p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Your portrait has been sent to our printing workshop.
                  You&apos;ll receive a tracking number at{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    {customerEmail}
                  </span>{" "}
                  within 2–3 business days.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--surface-container-low)] p-5">
              <span className="mt-0.5 shrink-0 text-2xl" role="img" aria-label="truck">
                🚚
              </span>
              <div>
                <p className="font-semibold">Your canvas is being prepared</p>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Your portrait has been sent to our printing workshop.
                  You&apos;ll receive a tracking number at{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    {customerEmail}
                  </span>{" "}
                  within 2–3 business days.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── Order summary ── */}
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 font-[var(--font-playfair)] text-xl font-bold">
            Order summary
          </h2>

          {imageUrl ? (
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative aspect-[4/5] w-full max-w-[280px] shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] shadow-[0_8px_16px_rgba(32,60,185,0.08)]">
                <Image
                  src={imageUrl}
                  alt="Your portrait"
                  fill
                  sizes="280px"
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                  Delivering to
                </p>
                <p className="mt-1 text-lg font-bold">{customerEmail}</p>
                <p className="mt-4 text-xs text-[var(--on-surface-variant)]">
                  Order reference:{" "}
                  <span className="font-mono font-semibold text-[var(--primary)]">
                    {orderRef}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-10 text-center text-sm text-[var(--on-surface-variant)]">
              Portrait image could not be loaded from this session.
            </div>
          )}
        </section>

        {/* ── LTV upsell banner ── */}
        <section className="rounded-[var(--radius-xl)] border border-[var(--tertiary)]/30 bg-gradient-to-br from-[var(--tertiary-container)]/20 to-[var(--tertiary)]/10 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--tertiary-container)] text-3xl">
              👑
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-[var(--font-playfair)] text-xl font-bold">
                Want another one?
              </h3>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                Create another portrait now with{" "}
                <strong>50% off</strong> using the code:{" "}
                <span className="inline-block rounded bg-[var(--tertiary-container)] px-3 py-1 font-mono text-sm font-bold tracking-wider text-[var(--on-tertiary-container)]">
                  FAMILY50
                </span>
              </p>
            </div>
            <Link
              href="/?promo=FAMILY50"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--on-primary)] transition hover:brightness-110"
            >
              Create another portrait
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
