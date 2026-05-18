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
      "It is simple. Enter your pet's name in the personalization notes and complete your purchase. Then, send us a clear, high-quality photo through Etsy messages. Our experienced artist will manually complete your digital painting within 1-2 days.",
  },
  {
    question: "Is my photo good enough?",
    answer:
      "We need a clear, well-lit, and detailed photo to capture your pet's unique features. If your photo does not meet the requirements for the best illustration, do not worry. We will contact you as soon as possible to address the issue and find a better picture together.",
  },
  {
    question: "Can I include multiple pets in one portrait?",
    answer:
      "Each listing covers 1 pet. If you want two pets in the same illustration, please purchase two listings and send us a message through Etsy to let us know.",
  },
  {
    question: "Can I request changes to the background color?",
    answer:
      "Absolutely. Our artist will carefully select a background color using color theory applied to your pet's coat. However, this can be easily adjusted and corrected during your digital proof review phase.",
  },
  {
    question: "How will the final portrait look?",
    answer:
      "Your pet's personality will be forever immortalized in an amazing, high-resolution digital painting delivered as an 8x11 in PNG file, perfect for screens or high-quality printing.",
  },
  {
    question: "Do you ship a physical canvas or print?",
    answer:
      "This product is a Digital Download only. No physical prints, canvases, or frames will be shipped. This gives you the flexibility to print it fast at home or your local print shop on any item you choose.",
  },
  {
    question: "How long does delivery take?",
    answer: "All digital drafts are completed and sent to your email for review within 1-2 days.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Due to the custom and digital nature of this product, no refunds, exchanges, or cancellations are accepted once the illustration process has started. However, we work closely with you during the review phase to guarantee you love the result.",
  },
  {
    question: "What if I lose my digital file?",
    answer:
      "Since it is a digital download, it cannot get damaged or lost in the mail. If you ever accidentally lose your digital file down the road, just send us a message with your order details and we will happily resend it to you.",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "You can request a cancellation as long as our artist has not started working on your custom portrait. Please contact us immediately through Etsy messages if you need to cancel.",
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
