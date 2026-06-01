"use client";

import Image from "next/image";
import { useState } from "react";
import FaqAccordion from "./components/faq-accordion";
import PortraitWizard from "./components/portrait-wizard";

const NAV_LINKS = [
  { href: "#styles", label: "Styles" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          <a href="#" className="absolute left-1/2 flex -translate-x-1/2 items-center" aria-label="Vibrant Paws home">
            <Image
              src="/logo/logo.png"
              alt="Vibrant Paws"
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
                    src="https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80"
                    alt="Royal pet portrait"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
                    alt="Vibrant dog portrait"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="-mt-4 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
                    alt="Playful portrait style"
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-3 shadow-[0_16px_30px_rgba(32,60,185,0.1)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80"
                    alt="Premium pet portrait"
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
                <span className="text-[var(--tertiary-container)]">350,000+</span>{" "}
                customers love{" "}
                <span className="italic text-[var(--tertiary-container)]">Vibrant Paws</span>
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
                { name: "Kurt Einwaechter", date: "1/19/2026", text: "The Godfather loved it!" },
                { name: "Jeff Wolf",        date: "1/11/2026", text: "The Wife loved it! And I love looking at it!!" },
                { name: "Jill Lerner",      date: "12/27/2025", text: "Big hit!!!!!!! Thank you!!!!" },
                { name: "Maria S.",         date: "2/3/2026",  text: "Absolutely stunning. Best gift I've ever given." },
                { name: "Tom H.",           date: "1/28/2026", text: "My dog looks absolutely regal. 10/10!" },
                { name: "Sarah M.",         date: "2/14/2026", text: "Looks like a real royal portrait! Unbelievable." },
                { name: "Chris P.",         date: "12/10/2025", text: "Got it framed and hung in the living room. Everyone asks about it." },
                { name: "Laura G.",         date: "1/5/2026",  text: "My cat is now officially royalty. She approves." },
                { name: "Daniel R.",        date: "3/1/2026",  text: "Ordered for my mom's birthday. She cried happy tears." },
                { name: "Emma T.",          date: "2/22/2026", text: "Shipping was super fast and quality is amazing!" },
                { name: "Ryan K.",          date: "3/8/2026",  text: "I did not expect it to look this good. Blew my mind." },
                { name: "Olivia F.",        date: "1/30/2026", text: "Got three made for my whole family. Will order again." },
                { name: "James B.",         date: "12/18/2025", text: "Perfect holiday gift. Everyone at the party loved it." },
                { name: "Sophia L.",        date: "2/8/2026",  text: "The likeness is incredible. Feels hand-painted." },
                { name: "Noah C.",          date: "3/15/2026", text: "Couple portrait looked like something from a museum." },
                { name: "Ava M.",           date: "1/22/2026", text: "Even my skeptical husband admitted it looked amazing." },
              ].map((review, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 sm:p-4"
                >
                  <div>
                    <p className="text-xs font-bold text-[var(--on-surface)] sm:text-sm">{review.name}</p>
                    <p className="text-[10px] text-amber-400 sm:text-xs">★★★★★</p>
                    <p className="text-[10px] text-[var(--on-surface-variant)] sm:text-xs">{review.date}</p>
                    <p className="mt-1 text-xs leading-snug text-[var(--primary)] sm:text-sm">{review.text}</p>
                  </div>
                  {/* Placeholder image */}
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--surface-container-high)]">
                    <div className="flex h-full w-full items-center justify-center text-[var(--on-surface-variant)] opacity-30">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="styles" className="bg-[var(--surface-container-low)] px-6 py-20">
          <div className="mx-auto max-w-[var(--container-max)]">
            <div className="mb-14 text-center">
              <h2 className="type-headline-md mb-3 text-[var(--on-surface)]">Styles that feel alive</h2>
              <p className="type-body-md mx-auto max-w-2xl text-[var(--on-surface-variant)]">
                Explore playful, premium portraits with expressive backgrounds and handcrafted details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Royal Icons", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80" },
                { label: "Beach Moods", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80" },
                { label: "Shark Riders", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80" },
                { label: "Studio Chic", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80" },
              ].map((card) => (
                <a key={card.label} className="group flex flex-col gap-3" href="#">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] transition-transform duration-300 group-hover:scale-[1.02]">
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="type-headline-sm text-center text-[var(--on-surface)]">{card.label}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[var(--outline-variant)] bg-[var(--surface-container)]">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-2 px-6 py-16">
          <div className="mb-8 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--on-surface)]">Vibrant Paws</div>
            <nav className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-surface)]">
              <a className="transition-all hover:text-[var(--primary)]" href="#">About</a>
              <a className="transition-all hover:text-[var(--primary)]" href="#">FAQ</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/contact">Contact</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/privacy">Privacy</a>
              <a className="transition-all hover:text-[var(--primary)]" href="/terms">Terms</a>
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--outline-variant)] pt-8 text-sm text-[var(--on-surface-variant)] md:flex-row">
            <p>© 2026 Vibrant Paws. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:text-[var(--primary)]">credit_card</span>
              <span className="material-symbols-outlined cursor-pointer transition-colors hover:text-[var(--primary)]">account_balance_wallet</span>
            </div>
          </div>
        </div>
      </footer>

      <section id="faq">
        <FaqAccordion />
      </section>
    </>
  );
}
