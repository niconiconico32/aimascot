"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type UploaderState = "idle" | "loading";

const TOTAL_SECONDS = 45;
const TICK_MS = 100;

export default function PortraitUploader() {
  const router = useRouter();
  const [uploaderState, setUploaderState] = useState<UploaderState>("idle");
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs so the interval callback can read up-to-date values without re-creating
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiDoneRef = useRef(false);
  const generatedUrlRef = useRef<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    apiDoneRef.current = false;
    generatedUrlRef.current = null;
    setProgress(0);
    setSecondsRemaining(TOTAL_SECONDS);
    setErrorMessage(null);
    setUploaderState("loading");

    // Fire the API call in parallel with the progress animation
    const body = new FormData();
    body.append("image", file);

    fetch("/api/generate", { method: "POST", body })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json() as Promise<{ imageUrl: string }>;
      })
      .then(({ imageUrl }) => {
        generatedUrlRef.current = imageUrl;
        apiDoneRef.current = true;
      })
      .catch(() => {
        setErrorMessage("Portrait generation failed. Please try again.");
        setUploaderState("idle");
      });
  };

  useEffect(() => {
    if (uploaderState !== "loading") return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        // API finished → rush to 100%
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

        // Cap at 90% while waiting for the API
        if (prev >= 90) {
          setSecondsRemaining(1);
          return 90;
        }

        const next = prev + 1;
        setSecondsRemaining(Math.max(1, Math.ceil(TOTAL_SECONDS * (1 - next / 100))));
        return next;
      });
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router, uploaderState]);

  if (uploaderState === "loading") {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-[#EFEBE4] bg-[#FAF8F5] p-6 text-center shadow-md">
        <h2 className="mb-4 font-[var(--font-playfair)] text-2xl font-bold text-[#2E2A47]">Painting your portrait</h2>

        <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-[#EFEBE4]">
          <div
            className="h-full rounded-full bg-[#312E81] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-1 text-3xl font-semibold text-[#2E2A47]">{progress}%</div>
        <div className="mb-6 text-sm text-[#8A6C5F]">~{secondsRemaining} seconds remaining</div>

        <div className="flex w-full items-center gap-3 rounded-xl border border-[#E9E3D8] bg-[#F3EFE7] p-3 text-left">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#d9cec0]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWIFMXi5aalQ-ZleY4ZuFCAih_ky6xfOcDl4L8y1RW0gj50kCMT3tOHcLkBNL27PvCDnLIHG-hKE9PhyOOpztgMTdS4P09SaDP-cJm1zvoGbG8e52zZYVG-PVTP0WqCw4Lv2eP_QFW0f3va5WsmTWgXcKx7my4B5RZxs4_R9OspRXLe1k_npA9C1SOsWJZcqbU1xNCb1oADRD8CvOSk9v02SuKBA-a0KzwQAxWJiZTsrFXzXXAj80oOAQACwEcXzUFzccc966hamEk"
              alt="Royal pet preview"
              fill
              sizes="64px"
              className="object-cover grayscale-[20%] sepia-[10%]"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#2E2A47]">Sarah M.</span>
              <div className="text-xs text-amber-500">★★★★★</div>
            </div>
            <p className="mt-1 text-xs italic text-[#8A6C5F]">&quot;My dog looks like actual royalty. 10/10!&quot;</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl text-center">
      {errorMessage && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <label className="group block cursor-pointer rounded-xl border-2 border-dashed border-[#c6c6cd] bg-[#f8f9ff] p-8 text-black shadow-lg transition-colors hover:border-[#775a19]">
        <input
          type="file"
          className="hidden"
          accept="image/jpeg, image/jpg, image/png, image/webp, image/avif"
          onChange={handleFileChange}
        />

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dde9ff] transition-colors group-hover:bg-[#fed488]">
          <span className="material-symbols-outlined text-3xl">upload</span>
        </div>

        <h3 className="mb-2 font-[var(--font-playfair)] text-2xl">Drop a photo or click to upload</h3>
        <p className="text-[#45464d]">Supports JPG, JPEG, PNG, WEBP, and AVIF</p>
      </label>
    </div>
  );
}
