"use client";

import { motion } from "framer-motion";
import { Download, Star } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CountUp } from "@/components/motion/CountUp";
import { easeOut, slideRight } from "@/lib/motion";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.003 1.003 0 01-1.417-.13 1.003 1.003 0 01-.193-.63V2.644c0-.24.086-.472.244-.65a1.003 1.003 0 011.366-.18zm2.983 1.233l9.803 9.803-3.198 3.198L3.61 3.047h2.982zm0 17.906l6.588-6.588 3.198 3.198-9.786 3.39zM16.61 13.807l2.807 2.807-6.17 2.134 3.363-4.941z" />
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[260px]">
      <div className="rounded-[2rem] border-[6px] border-[var(--app-phone-border)] bg-[var(--app-phone-border)] p-2 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-[var(--app-phone-screen)]">
          {/* camera notch */}
          <div className="absolute right-4 top-3 z-10 h-2.5 w-2.5 rounded-full bg-[var(--app-phone-notch)]" />
          {/* placeholder UI */}
          <div className="space-y-3 p-5 pt-8">
            <div className="h-28 rounded-xl bg-[var(--app-phone-placeholder)]" />
            <div className="h-2 w-3/4 rounded-full bg-[var(--app-phone-placeholder)]" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-16 rounded-xl bg-[var(--app-phone-placeholder)]" />
              <div className="h-16 rounded-xl bg-[var(--app-phone-placeholder)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppDownloadSection() {
  return (
    <section className="hidden bg-background py-14 sm:py-20 lg:block">
      <div className="container-page">
        <AnimateIn>
          <div className="overflow-hidden rounded-3xl bg-[var(--app-cta-bg)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Left — copy & CTAs */}
              <div>
                <h2 className="text-3xl font-bold leading-tight text-[var(--app-cta-text)] sm:text-4xl lg:text-[2.75rem]">
                  Shopping at your fingertips.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--app-cta-muted)] sm:text-base">
                  Download the EdgeCart mobile app for exclusive app-only deals, instant
                  order tracking, and seamless shopping anywhere.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[var(--app-store-primary-bg)] px-5 text-sm font-semibold text-[var(--app-store-primary-text)]"
                  >
                    <AppleIcon className="h-5 w-5" />
                    App Store
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-[var(--app-store-outline-border)] bg-transparent px-5 text-sm font-semibold text-[var(--app-cta-text)]"
                  >
                    <PlayStoreIcon className="h-5 w-5" />
                    Google Play
                  </motion.a>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--app-cta-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    <CountUp value={500} suffix="k+" /> Downloads
                  </span>
                  <span className="hidden sm:inline">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <CountUp value={4} suffix=".9" /> App Rating
                  </span>
                </div>
              </div>

              {/* Right — phone mockup */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideRight}
                transition={{ duration: 0.7, ease: easeOut }}
                className="flex justify-center lg:justify-end"
              >
                <PhoneMockup />
              </motion.div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
