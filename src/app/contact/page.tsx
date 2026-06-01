"use client";

import { FormEvent, useMemo, useState } from "react";

const CATEGORIES = [
  "General Question",
  "Order Issue",
  "Refund Request",
  "Technical Problem",
  "Other",
] as const;

const MESSAGE_LIMIT = 5000;

export default function ContactPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0]);
  const [message, setMessage] = useState("");

  const charsUsed = useMemo(() => message.length, [message]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="bg-[var(--background)] px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-xl)] bg-[var(--surface-container-low)] p-6 sm:p-10">
        <h1 className="font-[var(--font-playfair)] text-5xl font-bold leading-none text-[var(--on-surface)]">
          Get Support
        </h1>
        <p className="mt-4 max-w-3xl text-[28px] leading-relaxed text-[var(--on-surface-variant)] sm:text-[30px]">
          Have a question or need help? Fill out the form below and we&apos;ll get back to you as soon as possible. You can also email us directly at{" "}
          <a className="font-medium text-[var(--primary)]" href="mailto:help@turnmeroyal.com">
            help@turnmeroyal.com
          </a>
        </p>

        <form className="mt-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-2xl font-medium text-[var(--on-surface-variant)]">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                className="h-14 w-full rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-[29px] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-2xl font-medium text-[var(--on-surface-variant)]">
                Email <span className="text-[var(--error)]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                autoComplete="email"
                className="h-14 w-full rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-[29px] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-2xl font-medium text-[var(--on-surface-variant)]">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}
                className="h-14 w-full rounded-[10px] border border-[var(--primary)] bg-[var(--surface-container-low)] px-4 text-[29px] text-[var(--on-surface)] focus:outline-none"
              >
                {CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="order-number" className="mb-2 block text-2xl font-medium text-[var(--on-surface-variant)]">
                Order Number
              </label>
              <input
                id="order-number"
                name="orderNumber"
                type="text"
                placeholder="e.g. CE0427A6"
                className="h-14 w-full rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-[29px] text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, MESSAGE_LIMIT))}
              maxLength={MESSAGE_LIMIT}
              rows={6}
              className="w-full rounded-[10px] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 text-[26px] text-[var(--on-surface)] focus:border-[var(--primary)] focus:outline-none"
            />
            <p className="mt-2 text-[23px] text-[var(--outline)]">{charsUsed}/{MESSAGE_LIMIT}</p>
          </div>

          <button
            type="submit"
            className="mt-6 h-14 w-full rounded-xl bg-[#3f3263] text-[30px] font-bold text-white transition hover:brightness-110"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
