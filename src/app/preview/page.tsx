"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CanvasSize = {
  label: string;
  price: number;
  badge?: string;
};

const CANVAS_SIZES: readonly CanvasSize[] = [
  { label: "8 x 10", price: 79 },
  { label: "12 x 16", price: 99 },
  { label: "18 x 24", price: 119, badge: "Popular" },
  { label: "24 x 36", price: 159 },
] as const;

export default function PreviewPage() {
  const [imagePreview] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("generatedPortraitUrl") ?? sessionStorage.getItem("portraitPreview");
  });
  const [selectedCanvasSize, setSelectedCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);

  const customerReviews = [
    {
      id: 1,
      name: "Kurt Einwaechter",
      rating: "★★★★★",
      date: "1/19/2026",
      text: "The Godfather loved it!",
      placeholderSrc:
        "https://images.unsplash.com/photo-1541599540903-216a46ca1df0?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Jeff Wolf",
      rating: "★★★★★",
      date: "1/11/2026",
      text: "The Wife loved it! And I love looking at it!!",
      placeholderSrc:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Jill Lerner",
      rating: "★★★★★",
      date: "12/27/2025",
      text: "Big hit!!!!!!! Thank you!!!!!",
      placeholderSrc:
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Sarah M.",
      rating: "★★★★★",
      date: "12/15/2025",
      text: "Incredible quality, my cat looks like a real queen.",
      placeholderSrc:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Michael T.",
      rating: "★★★★★",
      date: "11/30/2025",
      text: "Exceeded my expectations. Fast delivery too!",
      placeholderSrc:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: 6,
      name: "Emily R.",
      rating: "★★★★★",
      date: "11/22/2025",
      text: "The perfect gift for my husband. He laughed and cried.",
      placeholderSrc:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <main className="bg-[var(--background)] px-4 py-12 font-sans text-[var(--on-surface)] md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="mb-12 text-center">
          <h1 className="type-display-lg text-[var(--on-surface)]">Your portrait is ready</h1>
          <p className="type-body-md mt-3 text-[var(--on-surface-variant)]">
            Choose your delivery format and complete your order.
          </p>
        </div>

        {imagePreview ? (
        <div className="mb-16 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 shadow-[0_24px_40px_rgba(32,60,185,0.08)] md:p-6">
            {/* Security wrapper — blocks right-click, drag and "Save image as" */}
            <div
              className="relative h-[50vh] min-h-[350px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] select-none"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={imagePreview}
                alt="Generated portrait preview"
                fill
                unoptimized
                draggable={false}
                sizes="(min-width: 1024px) 960px, 100vw"
                className="pointer-events-none object-contain p-2 select-none"
              />
              {/* Transparent overlay — intercepts right-click / drag so the browser
                  never targets the <img> element directly */}
              <div
                aria-hidden
                className="absolute inset-0 z-10 cursor-default"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        ) : (
          <div className="mb-16 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-12 text-center text-[var(--on-surface-variant)]">
            <p className="type-body-md">We could not find an uploaded image in this session.</p>
            <div className="mt-4">
              <Link href="/" className="font-semibold text-[var(--primary)] underline transition hover:opacity-80">
                Go back and upload a photo
              </Link>
            </div>
          </div>
        )}

        <section className="mt-10">
          <div className="mb-10 text-center">
            <h2 className="type-headline-md text-[var(--on-surface)]">Pick your package</h2>
            <p className="type-body-md mt-2 text-[var(--on-surface-variant)]">No watermark. High-resolution final files.</p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            <article className="relative flex flex-col justify-between rounded-[var(--radius-xl)] border-2 border-[var(--tertiary-container)] bg-[var(--surface-container-lowest)] p-6 shadow-[0_16px_30px_rgba(32,60,185,0.08)] md:p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--tertiary-container)] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--on-tertiary-container)]">
                Best value
              </div>

              <div>
                <h3 className="mt-4 text-center font-[var(--font-playfair)] text-2xl font-bold text-[var(--on-surface)]">
                  Canvas + Digital
                </h3>

                <div className="my-6 text-center">
                  <span className="mr-2 text-lg font-medium text-[var(--on-surface-variant)] line-through opacity-70">$229</span>
                  <span className="text-5xl font-extrabold text-[var(--on-surface)]">$79</span>
                </div>

                <p className="mb-6 text-center text-sm leading-relaxed text-[var(--on-surface-variant)]">
                  Museum-quality canvas delivered to your door plus instant digital download.
                </p>

                <div className="mb-6 border-t border-[var(--outline-variant)] pt-4">
                  <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[var(--on-surface)]">
                    <span>Choose size:</span>
                    <div className="flex items-center gap-1 rounded-full bg-[var(--surface-container)] p-0.5 text-xs">
                      <span className="rounded-full bg-[var(--primary)] px-2.5 py-1 font-bold text-[var(--on-primary)]">in</span>
                      <span className="cursor-pointer px-2.5 py-1 font-medium text-[var(--on-surface-variant)]">cm</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                    {CANVAS_SIZES.map((size) => {
                      const isActive = selectedCanvasSize.label === size.label;

                      return (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => setSelectedCanvasSize(size)}
                          className={[
                            "relative rounded-[var(--radius-md)] bg-[var(--surface-container-lowest)] p-2 text-center transition",
                            isActive
                              ? "border-2 border-[var(--primary)] shadow-[0_12px_24px_rgba(32,60,185,0.12)]"
                              : "border border-[var(--outline-variant)] hover:border-[var(--secondary)]",
                          ].join(" ")}
                        >
                          {size.badge ? (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--secondary)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight text-[var(--on-secondary)]">
                              {size.badge}
                            </span>
                          ) : null}
                          <p className={size.badge ? "mt-1 font-bold text-[var(--on-surface)]" : "font-bold text-[var(--on-surface)]"}>
                            {size.label}
                          </p>
                          <p className="font-medium text-[var(--on-surface-variant)]">${size.price}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ul className="mb-8 space-y-2.5 text-sm text-[var(--on-surface)]">
                  <li className="flex items-center gap-2">🐾 <span className="font-medium">Premium canvas print</span></li>
                  <li className="flex items-center gap-2">🐾 <span className="font-medium">Digital file included</span></li>
                  <li className="flex items-center gap-2">🐾 <span className="font-medium">No watermark</span></li>
                  <li className="flex items-center gap-2">🐾 <span className="font-medium">Ready to hang</span></li>
                </ul>
              </div>

              <Link
                href={`/cart?package=canvas-digital&size=${encodeURIComponent(selectedCanvasSize.label)}&price=${selectedCanvasSize.price}`}
                className="block w-full rounded-[var(--radius-default)] bg-[var(--tertiary-container)] px-8 py-4 text-center text-base font-bold text-[var(--on-tertiary-container)] transition hover:brightness-110"
              >
                Order Canvas + Digital — ${selectedCanvasSize.price}
              </Link>
            </article>

            <article className="relative flex flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 shadow-[0_16px_30px_rgba(32,60,185,0.06)] md:p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--secondary)] px-5 py-1.5 text-xs font-bold text-[var(--on-secondary)]">
                Digital only
              </div>

              <div>
                <h3 className="mt-4 text-center font-[var(--font-playfair)] text-2xl font-bold text-[var(--on-surface)]">
                  Digital Download
                </h3>

                <div className="my-6 text-center">
                  <span className="mr-2 text-lg font-medium text-[var(--on-surface-variant)] line-through opacity-70">$59</span>
                  <span className="text-5xl font-extrabold text-[var(--on-surface)]">$49</span>
                </div>

                <p className="mb-8 text-center text-sm leading-relaxed text-[var(--on-surface-variant)]">
                  High-resolution artwork file, ready to download and print anywhere.
                </p>

                <ul className="mb-12 space-y-3 border-t border-[var(--outline-variant)] pt-6 text-sm text-[var(--on-surface)]">
                  <li className="flex items-center gap-2">✓ <span className="font-medium">High-res PNG file</span></li>
                  <li className="flex items-center gap-2">✓ <span className="font-medium">Instant delivery</span></li>
                  <li className="flex items-center gap-2">✓ <span className="font-medium">Print-friendly format</span></li>
                  <li className="flex items-center gap-2">✓ <span className="font-medium">Use on any product</span></li>
                </ul>
              </div>

              <Link
                href="/cart?package=digital&price=49"
                className="block w-full rounded-[var(--radius-default)] border-2 border-[var(--primary)] py-3.5 text-center text-base font-bold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-[var(--on-primary)]"
              >
                Download Digital Only — $49
              </Link>
            </article>
          </div>

          <div className="mt-12 text-center text-sm text-[var(--on-surface-variant)]">
            <p className="font-medium">Secure checkout and money-back guarantee</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[var(--on-surface)]">
              <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-1.5">Mastercard</span>
              <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-1.5">VISA</span>
              <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-1.5">Apple Pay</span>
              <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-1.5">Google Pay</span>
              <span className="rounded-md border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 py-1.5">PayPal</span>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-[var(--outline-variant)] pt-16">
          <div className="mb-12 text-center">
            <h2 className="type-headline-md text-[var(--on-surface)]">
              Loved by <span className="text-[var(--secondary)]">thousands</span> of pet parents
            </h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--on-surface-variant)]">
              <span className="tracking-wider text-[var(--tertiary-container)]">★★★★★</span>
              <span className="text-[var(--on-surface)]">12,258</span> reviews
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {customerReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-5 shadow-[0_12px_24px_rgba(32,60,185,0.05)] transition duration-300 hover:scale-[1.02]"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-[var(--on-surface)]">{review.name}</h3>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="tracking-tight text-[var(--tertiary-container)]">{review.rating}</span>
                    <span className="font-medium text-[var(--on-surface-variant)]">{review.date}</span>
                  </div>
                  <p className="mt-3 text-xs italic leading-relaxed text-[var(--on-surface)]">&ldquo;{review.text}&rdquo;</p>
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-container)]">
                  <Image
                    src={review.placeholderSrc}
                    alt={`Review by ${review.name}`}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-semibold text-[var(--primary)] underline transition hover:opacity-80">
            ← Upload a different photo
          </Link>
        </div>
      </div>
    </main>
  );
}
