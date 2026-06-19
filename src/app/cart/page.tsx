"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type CartFieldName = "email";

type UpsellProduct = {
  id:  "mug" ;
  name: string;
  price: number;
  emoji: string;
};

type ShipmentMethod = {
  carrier: string;
  serviceName: string;
  totalPrice: { amount: number; currency: string };
  deliveryDays: { min: number; max: number };
};

const PACKAGE_COPY = {
  "canvas-digital": {
    title: "Canvas + Digital",
    shipping: "Arrives in 5-8 business days",
  },
  digital: {
    title: "Digital Download",
    shipping: "Sent to your inbox in minutes",
  },
} as const;

const UPSELL_PRODUCTS: readonly UpsellProduct[] = [
  { id: "mug", name: "Add a Mug with this portrait", price: 18, emoji: "☕" },
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "MX", name: "Mexico" },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInputClass(hasError: boolean, isDisabled = false) {
  return [
    "w-full rounded-[var(--radius-default)] border bg-white px-4 py-3 text-sm outline-none transition",
    hasError
      ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-4 focus:ring-[rgba(186,26,26,0.14)]"
      : "border-[var(--outline-variant)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(32,60,185,0.12)]",
    isDisabled ? "disabled:cursor-not-allowed disabled:bg-[var(--surface-container)]" : "",
  ].join(" ");
}

function validateCartField(field: CartFieldName, value: string) {
  const trimmed = value.trim();

  switch (field) {
    case "email":
      if (!trimmed) return "Email is required.";
      if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
      return null;
    default:
      return null;
  }
}

function CartPageContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("leadEmail") ?? localStorage.getItem("leadEmail") ?? "";
  });
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingPostcode, setShippingPostcode] = useState("");
  const [shippingMethods, setShippingMethods] = useState<ShipmentMethod[]>([]);
  const [selectedShippingIdx, setSelectedShippingIdx] = useState(0);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const shippingDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [giftWrap, setGiftWrap] = useState(false);
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CartFieldName, string>>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedUpsells, setSelectedUpsells] = useState<Record<UpsellProduct["id"], number>>({
    mug: 0,
  });
  const [imagePreview] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("generatedPortraitUrl") ?? sessionStorage.getItem("portraitPreview");
  });
  const [promoCode, setPromoCode] = useState(() => {
    if (typeof window === "undefined") return "";
    return searchParams.get("promo") ?? sessionStorage.getItem("promoCode") ?? "";
  });
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromotion, setAppliedPromotion] = useState<{
    promotionCodeId: string;
    percentOff: number | null;
    amountOff: number | null;
    name: string | null;
  } | null>(null);

  const packageKey = searchParams.get("package") === "digital" ? "digital" : "canvas-digital";
  const size = searchParams.get("size") ?? "12 x 16";
  const basePrice = Number(searchParams.get("price") ?? (packageKey === "digital" ? 49 : 99));
  const packageDetails = PACKAGE_COPY[packageKey];

  const fetchShippingQuotes = useCallback(async (country: string, postcode: string) => {
    if (!country || !postcode || postcode.length < 3) return;

    setIsLoadingShipping(true);
    setShippingError(null);

    try {
      const res = await fetch("/api/shipping-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, postcode, size }),
      });

      const data = await res.json();

      if (!res.ok) {
        setShippingError(data.error ?? "Could not load shipping options.");
        setShippingMethods([]);
        return;
      }

      setShippingMethods(data.shipmentMethods ?? []);
      setSelectedShippingIdx(0);
    } catch {
      setShippingError("Network error. Please try again.");
      setShippingMethods([]);
    } finally {
      setIsLoadingShipping(false);
    }
  }, [size]);

  useEffect(() => {
    if (packageKey === "digital") return;

    if (shippingDebounce.current) clearTimeout(shippingDebounce.current);

    if (shippingCountry && shippingPostcode.length >= 3) {
      shippingDebounce.current = setTimeout(() => {
        fetchShippingQuotes(shippingCountry, shippingPostcode);
      }, 600);
    }

    return () => {
      if (shippingDebounce.current) clearTimeout(shippingDebounce.current);
    };
  }, [shippingCountry, shippingPostcode, packageKey, fetchShippingQuotes]);

  const selectedShipping = shippingMethods[selectedShippingIdx];

  const summary = useMemo(() => {
    const upsellTotal = UPSELL_PRODUCTS.reduce((sum, product) => {
      return sum + product.price * selectedUpsells[product.id];
    }, 0);
    const giftWrapFee = giftWrap ? 9 : 0;
    const shippingFee = packageKey === "digital" ? 0 : (selectedShipping?.totalPrice.amount ?? 0);
    const subtotal = basePrice + giftWrapFee + upsellTotal;

    let discountAmount = 0;
    if (appliedPromotion) {
      if (appliedPromotion.percentOff) {
        discountAmount = Math.round(subtotal * appliedPromotion.percentOff / 100);
      } else if (appliedPromotion.amountOff) {
        discountAmount = Math.round(appliedPromotion.amountOff / 100);
      }
    }

    const total = subtotal + shippingFee - discountAmount;

    return {
      giftWrapFee, shippingFee, subtotal, total, upsellTotal, discountAmount,
      shippingCarrier: selectedShipping?.carrier ?? "",
      shippingService: selectedShipping?.serviceName ?? "",
    };
  }, [basePrice, giftWrap, packageKey, selectedUpsells, appliedPromotion, selectedShipping]);

  const validateSingleField = (field: CartFieldName, value: string) => {
    const error = validateCartField(field, value);
    setFieldErrors((current) => {
      if (!error && !current[field]) return current;
      return { ...current, [field]: error ?? undefined };
    });
    return error;
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<CartFieldName, string>> = {};
    const fields: Array<[CartFieldName, string]> = [
      ["email", email],
    ];
    fields.forEach(([field, value]) => {
      const error = validateCartField(field, value);
      if (error) nextErrors[field] = error;
    });
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCheckout = async () => {
    try {
      setCheckoutError(null);

      if (!imagePreview) {
        setCheckoutError("Portrait preview missing. Go back and generate your portrait again.");
        return;
      }

      if (!validateForm()) {
        return;
      }

      setIsCheckingOut(true);

      const upsells = UPSELL_PRODUCTS.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: selectedUpsells[product.id],
        unitPrice: product.price,
      })).filter((product) => product.quantity > 0);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageKey,
          packageTitle: packageDetails.title,
          basePrice,
          size,
          artworkUrl: imagePreview,
          // Forward the clean (non-watermarked) Fal URL so the webhook can
          // upscale to 4K and send to Gelato / attach to delivery email.
          generatedImageUrl: sessionStorage.getItem("cleanPortraitUrl") ?? "",
          shippingFee: summary.shippingFee,
          shippingMethod: summary.shippingCarrier ? `${summary.shippingCarrier} ${summary.shippingService}` : "standard",
          giftWrap,
          smsUpdates,
          email,
          cancelPath: `${window.location.pathname}${window.location.search}`,
          upsells,
          ...(appliedPromotion ? { promotionCodeId: appliedPromotion.promotionCodeId } : {}),
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start Stripe checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Could not start Stripe checkout.");
      setIsCheckingOut(false);
    }
  };

  const validateAndApplyPromo = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setPromoError("Please enter a promo code.");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError(null);

    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await res.json();

      if (!data.valid) {
        setPromoError(data.error ?? "Invalid promo code.");
        setAppliedPromotion(null);
        return;
      }

      setAppliedPromotion({
        promotionCodeId: data.promotionCodeId,
        percentOff: data.coupon.percentOff ?? null,
        amountOff: data.coupon.amountOff ?? null,
        name: data.coupon.name ?? null,
      });
    } catch {
      setPromoError("Could not validate promo code. Please try again.");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromotion(null);
    setPromoCode("");
    setPromoError(null);
  };

  useEffect(() => {
    const promo = searchParams.get("promo") ?? sessionStorage.getItem("promoCode");
    if (promo && promo.trim() && !appliedPromotion) {
      validateAndApplyPromo(promo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid = useMemo(() => {
    return (
      Boolean(imagePreview) &&
      validateCartField("email", email) === null
    );
  }, [email, imagePreview]);

  return (
    <main className="min-h-screen bg-[var(--surface)] px-4 py-6 pb-28 text-[var(--on-surface)] sm:px-6 lg:py-12 lg:pb-12">
      <div className="mx-auto w-full max-w-[1080px]">

        {/* ── Header: always on top ── */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--outline-variant)] pb-5">
          <h1 className="font-[var(--font-playfair)] text-2xl font-extrabold tracking-tight text-[var(--on-surface)] sm:text-3xl">
            Complete your order
          </h1>
          <Link
            href="/preview"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            ← Back
          </Link>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

          {/* ── Left: form ── */}
          <section className="order-2 flex-1 lg:order-1">
            <form className="space-y-5">
            {/* Email */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--on-surface)]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) validateSingleField("email", event.target.value);
                }}
                onBlur={(event) => validateSingleField("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                aria-invalid={fieldErrors.email ? "true" : "false"}
                className={getInputClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email ? (
                <p className="mt-1.5 text-sm text-[var(--error)]">{fieldErrors.email}</p>
              ) : (
                <p className="mt-1.5 text-xs text-[var(--on-surface-variant)]">Pre-fills your email in Stripe Checkout.</p>
              )}
            </label>


            {/* Shipping destination & method */}
            {packageKey !== "digital" ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <label className="block flex-1">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--on-surface)]">Country</span>
                    <select
                      value={shippingCountry}
                      onChange={(e) => { setShippingCountry(e.target.value); setShippingMethods([]); }}
                      className="w-full rounded-[var(--radius-default)] border border-[var(--outline-variant)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(32,60,185,0.12)]"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block flex-1">
                    <span className="mb-1.5 block text-sm font-semibold text-[var(--on-surface)]">Postal code</span>
                    <input
                      type="text"
                      value={shippingPostcode}
                      onChange={(e) => { setShippingPostcode(e.target.value); setShippingMethods([]); }}
                      placeholder="e.g. 10001"
                      autoComplete="postal-code"
                      maxLength={20}
                      className="w-full rounded-[var(--radius-default)] border border-[var(--outline-variant)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(32,60,185,0.12)]"
                    />
                  </label>
                </div>

                {isLoadingShipping && (
                  <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 py-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
                    <span className="text-sm text-[var(--on-surface-variant)]">Getting shipping rates…</span>
                  </div>
                )}

                {shippingError && (
                  <p className="text-sm text-[var(--error)]">{shippingError}</p>
                )}

                {shippingMethods.length > 0 && !isLoadingShipping && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[var(--on-surface)]">Shipping method</p>
                    {shippingMethods.map((method, idx) => (
                      <label
                        key={`${method.carrier}-${method.serviceName}`}
                        className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 transition ${
                          idx === selectedShippingIdx
                            ? "border-[var(--primary)] bg-[var(--primary-container)]/10"
                            : "border-[var(--outline-variant)] bg-white hover:border-[var(--primary)]/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={idx === selectedShippingIdx}
                          onChange={() => setSelectedShippingIdx(idx)}
                          className="h-4 w-4 shrink-0 text-[var(--primary)]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--on-surface)]">
                            {method.carrier} {method.serviceName}
                          </p>
                          <p className="text-xs text-[var(--on-surface-variant)]">
                            {method.deliveryDays.min}–{method.deliveryDays.max} business days
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[var(--on-surface)] shrink-0">
                          ${method.totalPrice.amount.toFixed(2)}
                        </p>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--on-surface)]">Digital delivery</p>
                <p className="mt-0.5 text-xs text-[var(--on-surface-variant)]">
                  No shipping needed — delivered to your inbox.
                </p>
              </div>
            )}

            {/* Desktop CTA */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut || !isFormValid}
              className="hidden w-full rounded-[var(--radius-default)] bg-[var(--primary)] px-5 py-4 text-base font-bold text-[var(--on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 lg:block"
            >
              {isCheckingOut ? "Redirecting to Stripe…" : `Pay $${summary.total.toFixed(2)} securely`}
            </button>
            {checkoutError ? (
              <p className="text-sm font-medium text-[var(--error)]">{checkoutError}</p>
            ) : null}
          </form>
        </section>

        {/* ── Right: order summary ── */}
        <aside className="order-1 w-full lg:sticky lg:top-6 lg:order-2 lg:w-[340px] lg:shrink-0">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-sm">
            {/* Portrait */}
            {imagePreview ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
                <Image
                  src={imagePreview}
                  alt="Your portrait"
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 340px, 100vw"
                  className="object-contain p-2"
                />
              </div>
            ) : null}

            <div className="p-4 sm:p-5">
              {/* Package */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--outline-variant)]">
                <div>
                  <p className="font-semibold text-[var(--on-surface)]">{packageDetails.title}</p>
                  <p className="mt-0.5 text-sm text-[var(--on-surface-variant)]">
                    {packageKey === "digital" ? "Digital delivery" : `Size: ${size}`}
                  </p>
                </div>
                <p className="text-lg font-extrabold text-[var(--on-surface)]">${basePrice}</p>
              </div>

              {/* Upsells */}
              <div className="mt-4 space-y-2.5">
                {UPSELL_PRODUCTS.map((product) => {
                  const quantity = selectedUpsells[product.id];
                  return (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-white px-3 py-2.5"
                    >
                      <input
                        type="checkbox"
                        checked={quantity > 0}
                        onChange={() =>
                          setSelectedUpsells((c) => ({ ...c, [product.id]: c[product.id] > 0 ? 0 : 1 }))
                        }
                        className="h-4 w-4 shrink-0 rounded border-[var(--outline)] text-[var(--primary)]"
                      />
                      <span className="text-xl">{product.emoji}</span>
                      <span className="flex-1 text-sm font-medium text-[var(--on-surface)]">{product.name}</span>
                      {quantity > 0 && (
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <button
                            type="button"
                            onClick={() => setSelectedUpsells((c) => ({ ...c, [product.id]: Math.max(0, c[product.id] - 1) }))}
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--surface-container)]"
                            aria-label={`Decrease ${product.name}`}
                          >−</button>
                          <span className="w-4 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedUpsells((c) => ({ ...c, [product.id]: c[product.id] + 1 }))}
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--surface-container)]"
                            aria-label={`Increase ${product.name}`}
                          >+</button>
                        </div>
                      )}
                      <span className="text-sm font-bold text-[var(--on-surface)]">${product.price}</span>
                    </label>
                  );
                })}
              </div>

              {/* Promo code */}
              <div className="mt-4 border-t border-[var(--outline-variant)] pt-4">
                {appliedPromotion ? (
                  <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--tertiary)]/30 bg-[var(--tertiary-container)]/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--on-surface)]">
                        {appliedPromotion.name ?? promoCode}
                      </span>
                      {appliedPromotion.percentOff && (
                        <span className="text-xs font-bold text-[var(--tertiary)]">
                          {appliedPromotion.percentOff}% off
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--error)]"
                      aria-label="Remove promo code"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-white px-3 py-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          if (promoError) setPromoError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            validateAndApplyPromo(promoCode);
                          }
                        }}
                        placeholder="Promo code"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                        disabled={isValidatingPromo}
                      />
                      <button
                        type="button"
                        onClick={() => validateAndApplyPromo(promoCode)}
                        disabled={isValidatingPromo || !promoCode.trim()}
                        className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-[var(--on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isValidatingPromo ? "..." : "Apply"}
                      </button>
                    </label>
                    {promoError && (
                      <p className="text-xs text-[var(--error)]">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 border-t border-[var(--outline-variant)] pt-4 text-sm">
                {summary.upsellTotal > 0 && (
                  <div className="flex justify-between text-[var(--on-surface-variant)]">
                    <span>Add-ons</span><span>+${summary.upsellTotal}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-[var(--on-surface-variant)]">
                  <span>
                    Shipping
                    {summary.shippingCarrier ? (
                      <span className="block text-xs">{summary.shippingCarrier} {summary.shippingService}</span>
                    ) : null}
                  </span>
                  <span className="text-right">{summary.shippingFee === 0 ? "Free" : `$${summary.shippingFee.toFixed(2)}`}</span>
                </div>
                {summary.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-[var(--tertiary)]">
                    <span>Discount</span>
                    <span>-${summary.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[var(--on-surface)]">
                  <span>Total</span>
                  <span className="text-[var(--primary)]">${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
        </div>{/* end two-column flex */}
      </div>{/* end max-w wrapper */}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--outline-variant)] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--on-surface-variant)]">Total</p>
            <p className="text-xl font-extrabold text-[var(--primary)]">${summary.total.toFixed(2)}</p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut || !isFormValid}
            className="rounded-[var(--radius-default)] bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut ? "Redirecting…" : "Pay securely"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--surface)] px-4 py-6 text-[var(--on-surface)]" />}>
      <CartPageContent />
    </Suspense>
  );
}