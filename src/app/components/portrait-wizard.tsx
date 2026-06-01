"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type Step = 1 | 2 | 3;
type Subject = "man" | "woman" | "couple" | "pet";
type Style = "royalty" | "beach" | "shark";

const SUBJECTS: { id: Subject; label: string; emoji: string; image: string; description: string }[] = [
  { id: "man",    label: "Man",    emoji: "🧑", image: "/firstform/man.jpeg",     description: "Solo male portrait" },
  { id: "woman",  label: "Woman",  emoji: "👩", image: "/firstform/woman.jpeg",   description: "Solo female portrait" },
  { id: "couple", label: "Couple", emoji: "💑", image: "/firstform/couple.jpeg",  description: "Two people together" },
  { id: "pet",    label: "Pet",    emoji: "🐾", image: "/firstform/pet.jpeg",     description: "Dog, cat or any pet" },
];

const STYLES: { id: Style; label: string; emoji: string; description: string }[] = [
  { id: "royalty", label: "Royalty",      emoji: "👑", description: "18th-century royal oil painting" },
  { id: "beach",   label: "On the Beach", emoji: "🏖️", description: "Golden-hour tropical scene" },
  { id: "shark",   label: "Shark Rider",  emoji: "🦈", description: "Epic shark-riding adventure" },
];

const STEPS = ["Subject", "Style", "Upload"];
const TOTAL_SECONDS = 45;
const TICK_MS = 100;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── TEST MODE ──────────────────────────────────────────────────────────────
// Set to `true` to bypass the AI API and use the uploaded photo directly.
// See ENABLE-API.md in the project root for instructions to re-enable.
const TEST_MODE = false;
// ────────────────────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {STEPS.map((label, i) => {
        const n      = i + 1;
        const active = step === n;
        const done   = step > n;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active ? "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]"
                  : done  ? "bg-[var(--secondary)] text-[var(--on-secondary)]"
                          : "bg-white/20 text-white/50"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-widest ${
                  active ? "text-[var(--tertiary-fixed)]" : done ? "text-white/85" : "text-white/45"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-5 h-px w-10 transition-colors ${step > n ? "bg-[var(--secondary-container)]" : "bg-white/20"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PortraitWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [styleIdx, setStyleIdx] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [personalizeText, setPersonalizeText] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("leadEmail") ?? localStorage.getItem("leadEmail") ?? "";
  });
  const [notifyEmailError, setNotifyEmailError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiDoneRef = useRef(false);
  const generatedUrlRef = useRef<string | null>(null);

  const handleSubjectSelect = (s: Subject) => { setSubject(s); setStep(2); };
  const handleStyleSelect   = (s: Style)   => { setStyle(s);   setStep(3); };

  const validateNotifyEmail = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required so we can notify you when the portrait is ready.";
    if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
    return null;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("File must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleGenerate = () => {
    if (!selectedFile) return;

    const emailError = validateNotifyEmail(notifyEmail);
    if (emailError) {
      setNotifyEmailError(emailError);
      return;
    }

    const trimmedEmail = notifyEmail.trim();
    const leadDraft = JSON.stringify({
      email: trimmedEmail,
      subject,
      style,
      capturedAt: new Date().toISOString(),
    });

    sessionStorage.setItem("leadEmail", trimmedEmail);
    localStorage.setItem("leadEmail", trimmedEmail);
    sessionStorage.setItem("portraitLeadDraft", leadDraft);
    localStorage.setItem("portraitLeadDraft", leadDraft);
    setNotifyEmailError(null);

    // Fire-and-forget: persist lead to Supabase via server route
    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: trimmedEmail,
        subject,
        style,
        personalizeText: personalizeText.trim() || undefined,
      }),
    });

    if (TEST_MODE) {
      // ── Test path: use the uploaded photo directly, no API call ──
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem("generatedPortraitUrl", reader.result as string);
        router.push("/preview");
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    // ── Real API path ── (see ENABLE-API.md to re-enable)
    apiDoneRef.current      = false;
    generatedUrlRef.current = null;
    setProgress(0);
    setSecondsRemaining(TOTAL_SECONDS);
    setErrorMessage(null);
    setIsLoading(true);

    const body = new FormData();
    body.append("image", selectedFile);
    if (subject) body.append("subject", subject);
    if (style)   body.append("style", style);
    if (personalizeText.trim()) body.append("personalize", personalizeText.trim());

    fetch("/api/generate", { method: "POST", body })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json() as Promise<{ imageUrl: string }>;
      })
      .then(({ imageUrl }) => {
        generatedUrlRef.current = imageUrl;
        apiDoneRef.current      = true;
      })
      .catch(() => {
        setErrorMessage("Portrait generation failed. Please try again.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!isLoading) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (apiDoneRef.current) {
          const next = Math.min(100, prev + 5);
          if (next >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => {
              const url = generatedUrlRef.current;
              if (url) {
                sessionStorage.setItem("generatedPortraitUrl", url);
                router.push("/preview");
              }
            }, 600);
          }
          return next;
        }
        if (prev >= 90) { setSecondsRemaining(1); return 90; }
        const next = prev + 1;
        setSecondsRemaining(Math.max(1, Math.ceil(TOTAL_SECONDS * (1 - next / 100))));
        return next;
      });
    }, TICK_MS);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLoading, router]);

  /* ──────────────── Loading screen ──────────────── */
  if (isLoading) {
    const loadingEmoji =
      subject === "pet" ? "🐾" : subject === "couple" ? "💑" : subject === "woman" ? "👸" : "🤴";
    return (
      <div className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 text-center shadow-[0_20px_30px_rgba(32,60,185,0.08)]">
        <h2 className="mb-4 font-[var(--font-playfair)] text-2xl font-bold text-[var(--on-surface)]">
          Painting your portrait
        </h2>
        <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-container-high)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mb-1 text-3xl font-semibold text-[var(--on-surface)]">{progress}%</div>
        <div className="mb-6 text-sm text-[var(--on-surface-variant)]">~{secondsRemaining} seconds remaining</div>
        <div className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3 text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-container-high)] text-3xl">
            <span>{loadingEmoji}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--on-surface)]">Sarah M.</span>
              <div className="text-xs text-[var(--tertiary-container)]">★★★★★</div>
            </div>
            <p className="mt-1 text-xs italic text-[var(--on-surface-variant)]">
              &quot;Absolutely stunning — looks like a real royal portrait!&quot;
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────────── Step indicator ──────────────── */

  /* ──────────────── Step 1: Subject ──────────────── */
  if (step === 1) {
    return (
      <div className="w-full max-w-xl">
        <StepIndicator step={step} />
        <p className="mb-4 text-center text-sm font-medium text-white/60">
          Who is this portrait for?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSubjectSelect(s.id)}
              className="group overflow-hidden rounded-[var(--radius-xl)] border-2 border-white/15 bg-white/5 text-left transition-all duration-200 hover:border-[var(--tertiary-fixed)] hover:shadow-lg hover:shadow-black/25 active:scale-[0.97]"
            >
              {/* Image */}
              <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 280px"
                />
                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>

              {/* Label row */}
              <div className="flex items-center justify-between px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    {s.label} {s.emoji}
                  </p>
                  <p className="truncate text-xs text-white/55">{s.description}</p>
                </div>
                <span className="ml-2 shrink-0 text-xl text-white/30 transition-colors duration-200 group-hover:text-[var(--tertiary-fixed)]">
                  ›
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ──────────────── Step 2: Style (carousel) ──────────────── */
  if (step === 2) {
    const current = STYLES[styleIdx];
    const prev = () => setStyleIdx((i) => (i - 1 + STYLES.length) % STYLES.length);
    const next = () => setStyleIdx((i) => (i + 1) % STYLES.length);
    return (
      <div className="w-full max-w-xl">
        <StepIndicator step={step} />

        {/* Carousel row */}
        <div className="flex items-center gap-3">
          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous style"
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white text-lg transition hover:border-[var(--tertiary-fixed)] hover:bg-white/20"
          >
            ‹
          </button>

          {/* Card */}
          <div className="flex-1 overflow-hidden rounded-[var(--radius-xl)] border-2 border-white/10 bg-white/10 backdrop-blur-sm">
            {/* Image */}
            <div className="relative w-full" style={{ aspectRatio: "14/15" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/style-preview.jpg"
                alt={current.label}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="px-5 py-4 text-center">
              <p className="text-lg font-bold text-white">
                {current.emoji} {current.label}
              </p>
              <p className="mt-1 text-sm text-white/70">{current.description}</p>
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next style"
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white text-lg transition hover:border-[var(--tertiary-fixed)] hover:bg-white/20"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {STYLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStyleIdx(i)}
              aria-label={`Style ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === styleIdx ? "w-5 bg-[var(--tertiary-container)]" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Select button */}
        <button
          onClick={() => handleStyleSelect(current.id)}
          className="mt-5 w-full rounded-full bg-[var(--tertiary-container)] py-3 text-center text-sm font-bold text-[var(--on-tertiary-container)] transition hover:brightness-110"
        >
          Choose {current.label} →
        </button>

        <button
          onClick={() => setStep(1)}
          className="mt-3 w-full text-center text-sm text-white/50 transition hover:text-white/80"
        >
          ← Back
        </button>
      </div>
    );
  }

  /* ──────────────── Step 3: Upload ──────────────── */
  return (
    <div className="w-full max-w-xl">
      <StepIndicator step={step} />
      <h2 className="mb-6 text-center font-[var(--font-playfair)] text-2xl font-bold text-white">
        Upload your photo
      </h2>
      {errorMessage && (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {selectedFile && previewUrl ? (
        /* ── File selected: preview + form ── */
        <div className="rounded-[var(--radius-xl)] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          {/* Thumbnail row */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Your photo" className="h-full w-full object-cover" />
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-[10px] transition hover:bg-black/80"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{selectedFile.name}</p>
              <p className="mt-0.5 text-xs text-white/50">Ready to paint</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold text-white">
              Get notified when your portrait is ready
            </label>
            <input
              type="email"
              value={notifyEmail}
              onChange={(event) => {
                setNotifyEmail(event.target.value);
                if (notifyEmailError) setNotifyEmailError(validateNotifyEmail(event.target.value));
              }}
              onBlur={(event) => setNotifyEmailError(validateNotifyEmail(event.target.value))}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              maxLength={120}
              className="h-14 w-full rounded-[var(--radius-default)] border border-white/20 bg-[color:rgba(219,222,255,0.2)] px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition focus:border-[var(--primary-fixed)] focus:border-2"
            />
            {notifyEmailError ? (
              <p className="mt-2 text-xs text-[rgb(255,205,205)]">{notifyEmailError}</p>
            ) : (
              <p className="mt-2 text-xs text-white/60">We use this for ready alerts and abandoned-cart follow-up.</p>
            )}
          </div>

          {/* Personalize input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={personalizeText}
              onChange={(e) => setPersonalizeText(e.target.value)}
              placeholder="Personalize – add a crown, scepter..."
              maxLength={120}
              className="h-14 w-full rounded-[var(--radius-default)] border border-white/20 bg-[color:rgba(219,222,255,0.2)] px-4 py-3 pr-20 text-sm text-white placeholder-white/50 outline-none transition focus:border-[var(--primary-fixed)] focus:border-2"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
              optional
            </span>
          </div>

          {/* Create button */}
          <button
            onClick={handleGenerate}
            className="w-full rounded-full bg-[var(--tertiary-container)] py-3.5 text-center text-sm font-bold text-[var(--on-tertiary-container)] transition hover:brightness-110"
          >
            ✦ Create your masterpiece
          </button>
        </div>
      ) : (
        /* ── No file yet: dropzone ── */
        <label className="group block cursor-pointer rounded-[var(--radius-xl)] border-2 border-dashed border-white/30 bg-white/10 p-8 text-center backdrop-blur-sm transition-all hover:border-[var(--tertiary-fixed)] hover:bg-white/20">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/jpg, image/png, image/webp, image/avif"
            onChange={handleFileChange}
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[var(--tertiary-container)]/20">
            <span className="material-symbols-outlined text-3xl text-white">upload</span>
          </div>
          <h3 className="mb-2 font-[var(--font-playfair)] text-xl text-white">
            Drop a photo or click to upload
          </h3>
          <p className="text-sm text-white/60">Supports image files up to 10 MB</p>
        </label>
      )}

      <button
        onClick={() => setStep(2)}
        className="mt-5 w-full text-center text-sm text-white/50 transition hover:text-white/80"
      >
        ← Back
      </button>
    </div>
  );
}
