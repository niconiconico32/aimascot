"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FaqAccordion from "./components/faq-accordion";
import PortraitWizard from "./components/portrait-wizard";

const NAV_LINKS = [
  { href: "#styles", label: "Styles" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

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

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const promo = params.get("promo");
    if (promo) {
      sessionStorage.setItem("promoCode", promo);
    }
  }, []);

  return (
    <>
      <div className="bg-[var(--primary)] py-2 text-center text-xs font-semibold tracking-[0.08em] text-[var(--on-primary)]">
        SPRING DROP: 60% OFF + FREE SHIPPING
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--outline-variant)] bg-[color:rgba(249,249,252,0.8)] backdrop-blur-[10px]">
        <div className="relative mx-auto flex h-14 w-full max-w-[var(--container-max)] items-center px-3 sm:px-4">
          <nav className="hidden items-center gap-5 text-xs font-medium text-[var(--on-surface-variant)] lg:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-[var(--primary)]">
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#" className="absolute left-1/2 flex -translate-x-1/2 items-center" aria-label="Crowned Portraits home">
            <Image
              src="/logo/logo.png"
              alt="Crowned Portraits"
              width={160}
              height={48}
              priority
              className="h-9 w-auto object-contain"
            />
          </a>

          <button
            className="ml-auto rounded-full p-1 text-[var(--on-surface)] transition-colors hover:text-[var(--primary)] lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span className="material-symbols-outlined text-[20px]">{isMobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-4 text-sm font-semibold text-[var(--on-surface)]">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="transition-colors hover:text-[var(--primary)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex flex-col bg-[var(--background)]">
        <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--primary-container)] to-[var(--secondary)] px-6 pb-16 pt-12 text-[var(--on-primary)] lg:py-24">
          <div className="pointer-events-none absolute -right-40  h-96 w-96 rounded-full bg-[var(--tertiary)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[var(--secondary-container)]/30 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-7">



              <PortraitWizard />

              <div className="flex flex-wrap gap-4 text-xs text-[color:rgba(255,255,255,0.85)]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-[var(--tertiary-fixed-dim)]">check</span>
                  <span>Free preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-[var(--tertiary-fixed-dim)]">check</span>
                  <span>No sign up</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-[var(--tertiary-fixed-dim)]">check</span>
                  <span>Private and secure</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="/examples/example1.jpeg"
                    alt="Royal king portrait example"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="/examples/example2.jpeg"
                    alt="Royal queen portrait example"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="-mt-4 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="/examples/example3.jpeg"
                    alt="Royal dog portrait example"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="/examples/example4.jpeg"
                    alt="Royal knight portrait example"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why us ── */}
        <section className="bg-[var(--primary)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[var(--container-max)]">
            {/* Heading */}
            <div className="mb-10 text-center">
              <h2 className="font-[var(--font-playfair)] text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Why{" "}
                <span className="text-[var(--tertiary-container)]">50,000+</span>{" "}
                customers love{" "}
                <span className="italic text-[var(--tertiary-container)]">Crowned Portraits</span>
              </h2>
              <p className="mt-3 text-sm text-white/70 sm:text-base">
                See your royal portrait in seconds — free preview, no card needed
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  emoji: "🎁",
                  title: "Start for free",
                  body: "Get a free preview — no card needed. Create your first portrait right now.",
                },
                {
                  emoji: "✨",
                  title: "AI magic",
                  body: "Stunning portraits in seconds. Made to make you look legendary.",
                },
                {
                  emoji: "🖼️",
                  title: "Works with any photo",
                  body: "Pets, people, couples, families — any photo becomes a masterpiece.",
                },
                {
                  emoji: "🚚",
                  title: "Free shipping on prints",
                  body: "Premium canvas prints shipped free. Museum-worthy quality, guaranteed.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary-container)] text-2xl">
                    {card.emoji}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{card.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof row */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {["/firstform/woman.jpeg", "/firstform/man.jpeg", "/firstform/couple.jpeg", "/firstform/pet.jpeg"].map(
                  (src, i) => (
                    <div
                      key={i}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[var(--primary)] shadow-md"
                    >
                      <Image src={src} alt="Happy customer" fill className="object-cover" sizes="40px" />
                    </div>
                  ),
                )}
              </div>
              <p className="text-sm text-white/80">
                <span className="font-extrabold text-[var(--tertiary-container)]">350,000+</span>{" "}
                happy customers turned into masterpieces!
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tertiary-container)] px-8 py-4 text-sm font-extrabold text-[var(--on-tertiary-container)] shadow-lg transition hover:brightness-110 active:scale-95 sm:text-base"
              >
                ✦ Create your portrait — free preview
              </a>
            </div>
          </div>
        </section>

        <section id="reviews" className="border-y border-[var(--outline-variant)] bg-[var(--surface-container)] py-8">
          <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-8 divide-y divide-[var(--outline-variant)] px-6 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="flex flex-col items-center justify-center gap-2 pt-4 md:pt-0">
              <div className="flex text-[var(--tertiary-container)]">
                <span className="material-symbols-outlined fill">star</span>
                <span className="material-symbols-outlined fill">star</span>
                <span className="material-symbols-outlined fill">star</span>
                <span className="material-symbols-outlined fill">star</span>
                <span className="material-symbols-outlined fill">star</span>
              </div>
              <div className="text-3xl font-extrabold text-[var(--on-surface)]">12,258</div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">verified reviews</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 pt-4 md:pt-0">
              <div className="text-3xl font-extrabold text-[var(--on-surface)]">1.2M+</div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">portraits generated</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 pt-4 md:pt-0">
              <div className="text-3xl font-extrabold text-[var(--on-surface)]">50+</div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface-variant)]">countries served</div>
            </div>
          </div>
        </section>

        {/* ── Customer testimonials ── */}
        <section className="bg-[var(--background)] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[var(--container-max)]">
            {/* Heading */}
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

            {/* Grid: 2 cols always on mobile, 3 cols on lg */}
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
          </div>
        </section>

      </main>



      <section id="faq">
        <FaqAccordion />
      </section>

      

            <footer className="mt-auto border-t border-[var(--outline-variant)] bg-[var(--surface-container)]">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-2 px-6 py-16">
          <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--on-surface)]">Crowned Portraits</div>
            <nav className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface)]">
              <a className="transition-all hover:text-[var(--primary)]" href="#">About</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/#faq">FAQ</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/contact">Contact</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/privacy">Privacy</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/terms">Terms</a>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--outline-variant)] pt-8 text-sm text-[var(--on-surface-variant)] md:flex-row">
            <p>© 2026 Crowned Portraits. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:text-[var(--primary)]">credit_card</span>
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:text-[var(--primary)]">account_balance_wallet</span>
            </div>
          </div>
        </div>
      </footer>
    </>

    
  );
}
