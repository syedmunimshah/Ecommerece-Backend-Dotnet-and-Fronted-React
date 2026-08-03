"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/content/home";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
          fill={i < rating ? "currentColor" : "none"}
          stroke={i < rating ? "none" : "currentColor"}
          strokeWidth={i < rating ? 0 : 1.5}
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="hidden bg-background py-14 sm:py-20 lg:block">
      <div className="container-page">
        <AnimateIn className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Verified reviews from Pakistani shoppers
          </p>
        </AnimateIn>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <StaggerItem key={item.id}>
              <motion.blockquote
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="flex h-full flex-col rounded-xl border border-border bg-[var(--card-bg)] p-6"
              >
                <ReviewStars rating={item.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
