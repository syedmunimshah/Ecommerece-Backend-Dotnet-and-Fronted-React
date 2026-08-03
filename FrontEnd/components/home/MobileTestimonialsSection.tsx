"use client";

import Image from "next/image";
import { MOBILE_TESTIMONIALS } from "@/lib/content/home";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400" : "text-gray-300"}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function MobileTestimonialsSection() {
  return (
    <section className="bg-background py-8 lg:hidden">
      <div className="px-4">
        <h2 className="mb-4 text-lg font-bold text-foreground">What Our Users Say</h2>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
          {MOBILE_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.id}
              className="w-[280px] shrink-0 rounded-2xl border border-border bg-[var(--card-bg)] p-5"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <Stars rating={item.rating} />
                </div>
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-muted">
                &ldquo;{item.quote}&rdquo;
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
