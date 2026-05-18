"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ReactionVideo = {
  id: number;
  name: string;
  rating: string;
  thumbnail: string;
};

const reactionVideos: ReactionVideo[] = [
  {
    id: 1,
    name: "Lynn S.",
    rating: "★★★★★",
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Andrea L.",
    rating: "★★★★★",
    thumbnail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Mary B.",
    rating: "★★★★★",
    thumbnail: "https://images.unsplash.com/photo-1537151625747-768eb6422652?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Jessica Q.",
    rating: "★★★★★",
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Kathryn J.",
    rating: "★★★★★",
    thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=80",
  },
];

export default function VideoReactionCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  useEffect(() => {
    if (isAutoPlayPaused) {
      return;
    }

    const interval = setInterval(() => {
      const slider = sliderRef.current;

      if (!slider) {
        return;
      }

      const nextLeft = slider.scrollLeft + 320;
      const maxLeft = slider.scrollWidth - slider.clientWidth;

      if (nextLeft >= maxLeft - 8) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isAutoPlayPaused]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="mt-24 border-t border-[#E8DED1] bg-[#F6F2EB] pt-16 font-sans text-[#544339]">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 rounded-full border border-[#E1D7C6] bg-[#EFEAE4] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#8A6C5F]">
            Reaction of the Month
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#544339] sm:text-4xl md:text-5xl">See why they cry happy tears</h2>
          <p className="mt-3 text-base text-[#8A6C5F]">From thousands of unboxing moments - this month&apos;s favourite</p>
        </div>

        <div
          className="group relative w-full"
          onMouseEnter={() => setIsAutoPlayPaused(true)}
          onMouseLeave={() => setIsAutoPlayPaused(false)}
          onFocusCapture={() => setIsAutoPlayPaused(true)}
          onBlurCapture={() => setIsAutoPlayPaused(false)}
        >
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DED1] bg-white text-[#544339] shadow-md transition hover:bg-[#FAF8F5] active:scale-95 sm:left-4"
            aria-label="Scroll left"
          >
            ←
          </button>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-8 pt-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reactionVideos.map((video) => (
              <article
                key={video.id}
                className="relative aspect-[9/16] w-[260px] flex-shrink-0 snap-start overflow-hidden rounded-3xl border border-[#E8DED1] bg-[#FAF8F5] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-[280px]"
              >
                <Image
                  src={video.thumbnail}
                  alt={`Unboxing reaction by ${video.name}`}
                  fill
                  sizes="280px"
                  className="object-cover brightness-[0.9]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex cursor-pointer items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-inner backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white/30">
                    <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-5 left-0 right-0 px-5 text-center text-white">
                  <h3 className="flex items-center justify-center gap-1.5 text-base font-bold">
                    {video.name}
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-black shadow-sm">
                      ✓
                    </span>
                  </h3>
                  <div className="mt-1 text-xs tracking-tight text-amber-400">{video.rating}</div>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DED1] bg-white text-[#544339] shadow-md transition hover:bg-[#FAF8F5] active:scale-95 sm:right-4"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[620px] rounded-2xl border border-[#E8DED1] bg-[#FAF8F5] p-5 shadow-[0_4px_25px_rgba(84,67,57,0.02)]">
          <div className="grid grid-cols-3 divide-x divide-[#EFEBE4] gap-2 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="mb-1 text-lg" role="img" aria-label="happy face">
                🥰
              </span>
              <span className="text-base font-black tracking-tight text-[#544339] md:text-lg">2,400+</span>
              <span className="mt-0.5 text-[11px] font-medium leading-tight text-[#8A6C5F]">happy reactions</span>
            </div>

            <div className="flex flex-col items-center justify-center px-1">
              <span className="mb-1 text-lg" role="img" aria-label="globe">
                🌏
              </span>
              <span className="text-base font-black tracking-tight text-[#544339] md:text-lg">50+</span>
              <span className="mt-0.5 text-[11px] font-medium leading-tight text-[#8A6C5F]">countries</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="mb-1 text-lg" role="img" aria-label="video icon">
                🎬
              </span>
              <span className="text-base font-black tracking-tight text-[#544339] md:text-lg">Monthly</span>
              <span className="mt-0.5 text-[11px] font-medium leading-tight text-[#8A6C5F]">reaction videos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
