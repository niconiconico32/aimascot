"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { STYLES_BY_SUBJECT, type Style, type Subject } from "@/data/styles";

type CanvasSize = {
  label: string;
  cmLabel: string;
  price: number;
  badge?: string;
};

const CANVAS_SIZES: readonly CanvasSize[] = [
  { label: "12 x 16", cmLabel: "30 x 40", price: 99 },
  { label: "18 x 24", cmLabel: "45 x 60", price: 119, badge: "Popular" },
  { label: "24 x 36", cmLabel: "60 x 90", price: 139 },
] as const;

const TESTIMONIALS_IMAGE_ORDER = [
  "test1.jpeg",
  "test2.jpeg",
  "test3.jpeg",
  "test4.jpeg",
  "test5.jpeg",
  "test6.jpeg",
  "test7.jpeg",
  "test8.jpeg",
  "test9.jpeg",
  "test10.jpeg",
  "test11.jpeg",
  "test12.jpeg",
];

export default function PreviewPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCanvasSize, setSelectedCanvasSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [showCm, setShowCm] = useState(false);
  const [generationParams, setGenerationParams] = useState<{
    originalFileName: string;
    subjectId: Subject;
    styleId: Style;
    personalizeText?: string;
  } | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    setImagePreview(
      sessionStorage.getItem("generatedPortraitUrl") ?? sessionStorage.getItem("portraitPreview"),
    );
    const raw = sessionStorage.getItem("generationParams");
    if (raw) {
      try { setGenerationParams(JSON.parse(raw)); } catch { /* ignore */ }
    }
    const storedRemaining = sessionStorage.getItem("remainingAttempts");
    if (storedRemaining !== null) {
      setRemainingAttempts(Number(storedRemaining));
    }
  }, []);

  const handleAddToCart = (packageType: string, price: number, size?: string) => {
    const params = new URLSearchParams({ package: packageType, price: String(price) });
    if (size) params.set("size", size);
    router.push(`/cart?${params.toString()}`);
  };

  const handleRegenerate = async (newStyleId?: Style) => {
    if (!generationParams) return;
    const styleId = newStyleId ?? generationParams.styleId;
    const styleOption = STYLES_BY_SUBJECT[generationParams.subjectId]?.find((s) => s.id === styleId);
    if (!styleOption) return;

    setIsRegenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: generationParams.originalFileName,
          subject: generationParams.subjectId,
          style: styleId,
          stylePrompt: styleOption.falPrompt,
          personalizeText: generationParams.personalizeText,
        }),
      });

      if (res.status === 429) {
        const body = await res.json() as { remainingAttempts?: number };
        setLimitReached(true);
        setRemainingAttempts(body.remainingAttempts ?? 0);
        sessionStorage.setItem("remainingAttempts", String(body.remainingAttempts ?? 0));
        setIsRegenerating(false);
        return;
      }

      if (!res.ok) throw new Error("Regeneration failed");
      const data = await res.json() as { imageData: string; cleanImageUrl?: string; remainingAttempts?: number };
      if (typeof data.remainingAttempts === "number") {
        setRemainingAttempts(data.remainingAttempts);
        sessionStorage.setItem("remainingAttempts", String(data.remainingAttempts));
        setLimitReached(false);
      }
      if (data.cleanImageUrl) {
        sessionStorage.setItem("cleanPortraitUrl", data.cleanImageUrl);
      }
      sessionStorage.setItem("generatedPortraitUrl", data.imageData);
      setImagePreview(data.imageData);
      if (newStyleId) {
        const updated = { ...generationParams, styleId: newStyleId };
        setGenerationParams(updated);
        sessionStorage.setItem("generationParams", JSON.stringify(updated));
      }
    } catch {
      /* silently ignore — could surface a toast */
    } finally {
      setIsRegenerating(false);
    }
  };

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

{generationParams && (
          <div className="mb-16 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-gradient-to-b from-[var(--surface-container-lowest)] to-[var(--surface-container-low)] p-6 shadow-sm md:p-8">
            <p className="mb-6 text-center text-sm font-medium text-[var(--on-surface-variant)]">
              {isRegenerating
                ? "Repainting your masterpiece..."
                : limitReached
                  ? "You've used your 5 free previews for today. Come back tomorrow or secure your package now."
                  : "Didn't like it? Try again or choose a new style."}
            </p>
            
            {isRegenerating ? (
              <div className="flex justify-center py-4">
                <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--surface-container-high)] border-t-[var(--primary)]" />
              </div>
            ) : limitReached ? null : (
              <div className="flex flex-col items-center gap-6">
                
                {/* ── Botón Principal de Reintento ── */}
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                  <button
                    onClick={() => handleRegenerate()}
                    className="group flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-[var(--on-primary)] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                  >
                    <span className="transition-transform duration-300 group-hover:rotate-180">↻</span>
                    Try Again
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--on-surface-variant)] opacity-60">
                    or
                  </span>
                </div>

                {/* ── Píldoras de Estilos con Imágenes ── */}
                <div className="flex flex-wrap justify-center gap-3">
                  {STYLES_BY_SUBJECT[generationParams.subjectId]
                    ?.filter((s) => s.id !== generationParams.styleId)
                    .map((styleOption) => (
                      <button
                        key={styleOption.id}
                        onClick={() => handleRegenerate(styleOption.id)}
                        className="group flex items-center gap-2.5 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] py-1.5 pl-1.5 pr-4 text-xs font-semibold text-[var(--on-surface)] shadow-sm transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--surface-container-lowest)] hover:shadow-md active:scale-95"
                      >
                        {/* Contenedor circular para la imagen miniatura */}
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[var(--outline-variant)] transition-transform duration-200 group-hover:scale-105">
                          <Image
                            src={styleOption.previewImage} // <- Asegúrate de que esta sea la propiedad correcta
                            alt={styleOption.label}
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        </div>
                        <span>{styleOption.label}</span>
                      </button>
                    ))}
                </div>

                {/* ── Contador de Intentos ── */}
                {remainingAttempts !== null && (
                  <p className="mt-2 text-center text-[11px] font-medium tracking-wide text-[var(--on-surface-variant)] opacity-80">
                    {remainingAttempts} free previews left
                  </p>
                )}
              </div>
            )}
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
                  <span className="mr-2 text-lg font-medium text-[var(--on-surface-variant)] line-through opacity-70">${Math.round(selectedCanvasSize.price * 1.7)}</span>
                  <span className="text-5xl font-extrabold text-[var(--on-surface)]">${selectedCanvasSize.price}</span>
                </div>

                <p className="mb-6 text-center text-sm leading-relaxed text-[var(--on-surface-variant)]">
                  Museum-quality canvas delivered to your door plus instant digital download.
                </p>

                <div className="mb-6 border-t border-[var(--outline-variant)] pt-4">
                  <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[var(--on-surface)]">
                    <span>Choose size:</span>
                    <div className="flex items-center gap-1 rounded-full bg-[var(--surface-container)] p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowCm(false)}
                        className={[
                          "rounded-full px-2.5 py-1 font-bold transition",
                          !showCm
                            ? "bg-[var(--primary)] text-[var(--on-primary)]"
                            : "font-medium text-[var(--on-surface-variant)]",
                        ].join(" ")}
                      >in</button>
                      <button
                        type="button"
                        onClick={() => setShowCm(true)}
                        className={[
                          "rounded-full px-2.5 py-1 font-bold transition",
                          showCm
                            ? "bg-[var(--primary)] text-[var(--on-primary)]"
                            : "font-medium text-[var(--on-surface-variant)]",
                        ].join(" ")}
                      >cm</button>
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
                            {showCm ? size.cmLabel : size.label}{showCm ? " cm" : `"`}
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

              <button
                onClick={() => handleAddToCart("canvas-digital", selectedCanvasSize.price, selectedCanvasSize.label)}
                className="block w-full rounded-[var(--radius-default)] bg-[var(--tertiary-container)] px-8 py-4 text-center text-base font-bold text-[var(--on-tertiary-container)] transition hover:brightness-110"
              >
                Order Canvas + Digital — ${selectedCanvasSize.price}
              </button>
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

              <button
                onClick={() => handleAddToCart("digital", 49)}
                className="block w-full rounded-[var(--radius-default)] border-2 border-[var(--primary)] py-3.5 text-center text-base font-bold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-[var(--on-primary)]"
              >
                Download Digital Only — $49
              </button>
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

        <section className="mt-20 border-t border-[var(--outline-variant)] bg-[var(--background)] pt-16">
          <div className="mb-10 text-center">
            <h2 className="font-[var(--font-playfair)] text-3xl font-extrabold leading-tight text-[var(--on-surface)] sm:text-4xl">
              Thousands of{" "}
              <span className="italic text-[var(--tertiary-container)] [color:var(--primary)]">happy customers.</span>{" "}
              See what they say.
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--on-surface-variant)]">
              <span className="text-amber-400">★★★★★</span>
              <span>12,258 Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              { name: "Kurt Einwaechter", date: "1/19/2026", text: "My grandma loved it!" },
              { name: "Jeff Wolf",        date: "1/11/2026", text: "My daughter looks so happy! Loved her birthday gift." },
              { name: "Jill Lerner",      date: "12/27/2025", text: "I knew he would like it. Thank you!" },
              { name: "Maria S.",         date: "2/3/2026",  text: "My wife loved the tribute to Milo. Thanks" },
              { name: "Tom H.",           date: "1/28/2026", text: "Finally, my queen." },
              { name: "Sarah M.",         date: "2/14/2026", text: "Looks like a real royal portrait! Unbelievable." },
              { name: "Chris P.",         date: "12/10/2025", text: "I absolutely win Father's Day with this gift. Thanks!" },
              { name: "Laura G.",         date: "1/5/2026",  text: "Cookie looking majestic!" },
              { name: "Daniel R.",        date: "3/1/2026",  text: "Ordered for my wife's birthday. She cried happy tears." },
              { name: "Emma T.",          date: "2/22/2026", text: "Shipping was super fast and quality is amazing!" },
              { name: "Ryan K.",          date: "3/8/2026",  text: "I did not expect it to look this good. Blew my mind." },
              { name: "Olivia F.",        date: "1/30/2026", text: "My wife loved her anniversary gift. Would recommend." }
            ].map((review, i) => {
              const imageFile = TESTIMONIALS_IMAGE_ORDER[i] ?? `test${i + 1}.jpeg`;
              const testimonialImage = `/testimonials/${imageFile}`;

              return (
                <div
                  key={`${review.name}-${imageFile}`}
                  className="flex flex-col gap-3 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 sm:p-4"
                >
                  <div>
                    <p className="text-xs font-bold text-[var(--on-surface)] sm:text-sm">{review.name}</p>
                    <p className="text-[10px] text-amber-400 sm:text-xs">★★★★★</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] sm:text-xs">{review.date}</p>
                    <p className="mt-1 text-xs leading-snug text-[var(--primary)] sm:text-sm">{review.text}</p>
                  </div>

                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--surface-container-high)]">
                    <Image
                      src={testimonialImage}
                      alt={`Testimonial de ${review.name}`}
                      unoptimized
                      fill
                      sizes="(min-width: 1024px) 22vw, 48vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
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
