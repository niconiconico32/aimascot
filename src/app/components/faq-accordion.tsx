"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does it work?",
    answer:
      "It takes less than 30 seconds. Upload a clear photo of your pet, choose your favourite art style, and our AI instantly generates a stunning regal portrait. Preview the result for free before paying — only purchase once you love it. Your digital download is delivered to your email immediately, and canvas prints ship within 5–7 business days.",
  },
  {
    question: "What if I don't like the result?",
    answer:
      "You preview the portrait before paying — no commitment. If you purchase and aren't completely happy, we'll work with you to make it right. Canvas and mug orders come with a satisfaction guarantee: contact us within 14 days if there's an issue and we'll send a free replacement.",
  },
  {
    question: "Is my photo good enough?",
    answer:
      "A clear, well-lit photo with your pet looking toward the camera produces the best result. Avoid blurry or dark images. If the photo doesn't meet our quality threshold, the preview page will let you know before you pay — just upload a better one.",
  },
  {
    question: "What can I order?",
    answer:
      "Every order includes a high-resolution digital download ($49) you can use for screens, social media, or printing at home. Upgrade to a gallery-quality canvas print in 12\u00D716, 18\u00D724, or 24\u00D736 inches. You can also add a premium ceramic coffee mug — perfect for the morning coffee ritual.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Digital downloads are available immediately after purchase — you'll receive a download link by email within minutes. Canvas prints are produced and shipped within 5–7 business days via our print partner. Mugs ship within 3–5 business days. You'll receive tracking updates by email the moment your order ships.",
  },
  {
    question: "Can I include multiple pets in one portrait?",
    answer:
      "Currently each portrait features one pet. Want a royal duo? Create separate portraits and use code PROCUSTOMER40OFF at checkout to get 40% off your second one.",
  },
  {
    question: "How will the final portrait look?",
    answer:
      "Your pet is transformed into a regal high-resolution digital portrait fit for a palace. The final image is delivered as a PNG file — perfect for sharing, framing, or displaying on your wall. Canvas prints use gallery-quality materials with vibrant, fade-resistant inks.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. All payments are processed securely through Stripe, the same payment platform trusted by millions of businesses worldwide. We never see or store your credit card details.",
  },
  {
    question: "Can I track my physical order?",
    answer:
      "Yes. Once your canvas or mug ships, we'll send you a tracking number and link by email so you can follow your package every step of the way.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Digital downloads are non-refundable once delivered because of their instant-access nature — but you preview the portrait before buying, so there are no surprises. Canvas and mug orders damaged during shipping will be replaced free of charge within 14 days of delivery.",
  },
  {
    question: "What if I lose my digital file?",
    answer:
      "No worries. If you ever misplace your download, just email us at hello@crownedportraits.com with your order details and we'll resend the link immediately — no questions asked.",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "Digital orders can't be cancelled once the download link has been sent (since you preview before paying). For canvas and mug orders, contact us within 2 hours of purchase and we'll cancel before production begins. After that, reach out and we'll do our best to help.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-[var(--surface-container)] px-6 py-24">
      <div className="mx-auto w-full max-w-[960px]">
        <h2 className="mb-12 text-center font-[var(--font-playfair)] text-4xl font-bold tracking-tight text-[var(--on-surface)] md:text-5xl">
          Questions &amp; <span className="text-[var(--secondary)]">Answers</span>
        </h2>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.question}
                className="rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-6 py-5 shadow-[0_16px_30px_rgba(32,60,185,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="font-sans text-lg font-semibold text-[var(--on-surface)] md:text-xl">
                    {item.question}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-5 w-5 transition-transform duration-300 ease-out ${isOpen ? "rotate-90" : "rotate-0"}`}
                    >
                      <path
                        d="M5 12h14m-6-6 6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-80 pt-4 opacity-100" : "max-h-0 pt-0 opacity-0"
                  }`}
                >
                  <p className="font-sans text-base leading-7 text-[var(--on-surface-variant)]">{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
