"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OrderConfirmedPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [imagePreview] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("generatedPortraitUrl") ?? sessionStorage.getItem("portraitPreview");
  });

  const orderNumber = sessionId ? `VP-${sessionId.slice(-8).toUpperCase()}` : "Pending Stripe reference";

  useEffect(() => {
    if (!sessionId) return;

    void fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 py-8 text-[var(--on-surface)] sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-[980px]">
        <section className="mb-6 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--secondary)]">Order confirmed</p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-extrabold leading-none text-[var(--on-surface)] sm:text-5xl">
            Thanks, your order is in.
          </h1>
          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">Order number</p>
            <p className="mt-2 text-2xl font-extrabold text-[var(--primary)] sm:text-3xl">{orderNumber}</p>
          </div>
          <p className="mt-4 text-sm text-[var(--on-surface-variant)]">
            Save this number if you need help with your order.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[var(--on-surface)]">Your portrait</h2>
            <Link href="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              Create another
            </Link>
          </div>

          {imagePreview ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
              <Image
                src={imagePreview}
                alt="Confirmed portrait order"
                fill
                unoptimized
                sizes="(min-width: 1024px) 860px, 100vw"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-10 text-center text-sm text-[var(--on-surface-variant)]">
              We could not recover the portrait image from this browser session.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--surface)] px-4 py-8 text-[var(--on-surface)]" />}>
      <OrderConfirmedPageContent />
    </Suspense>
  );
}