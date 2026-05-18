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
        <div className="mx-auto flex h-20 w-full max-w-[var(--container-max)] items-center justify-between px-6">
          <a href="#" className="font-[var(--font-playfair)] text-2xl font-extrabold text-[var(--on-surface)]">
            Vibrant Paws
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--on-surface-variant)] md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-[var(--primary)]">
                {link.label}
              </a>
            ))}
          </nav>

          <button
            className="rounded-full p-2 text-[var(--on-surface)] transition-colors hover:text-[var(--primary)] md:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-6 py-4 md:hidden">
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
          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[var(--tertiary)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[var(--secondary-container)]/30 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-[var(--container-max)] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-7">
              <span className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
                Modern Portrait Studio
              </span>
              <h1 className="type-display-lg text-center text-[var(--on-primary)] lg:text-left">
                Turn your pet into a bold, joyful masterpiece.
              </h1>
              <p className="type-body-lg mx-auto max-w-xl text-center text-[color:rgba(255,255,255,0.88)] lg:mx-0 lg:text-left">
                Pick a subject, choose a style, upload a photo and get a premium portrait preview in minutes.
              </p>

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
              <a className="transition-all hover:text-[var(--primary)]" href="#">Contact</a>
              <a className="transition-all hover:text-[var(--primary)]" href="#">Privacy</a>
              <a className="transition-all hover:text-[var(--primary)]" href="#">Terms</a>
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
