"use client";

import { motion } from "framer-motion";

export function ShopOnTheGoBanner() {
  return (
    <section className="bg-background px-4 pb-10 pt-2 lg:hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl bg-[var(--mobile-app-banner-bg)] px-6 py-8 text-center"
      >
        {/* decorative corner accent */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-white/10 rounded-br-2xl"
          aria-hidden
        />

        <h2 className="text-xl font-bold text-white">Shop on the Go!</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/75">
          Download our mobile app for faster checkout, order tracking, and
          app-exclusive rewards.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="#"
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--mobile-app-btn-bg)] text-sm font-semibold text-[var(--mobile-app-btn-text)] transition-opacity active:opacity-80"
          >
            Play Store
          </a>
          <a
            href="#"
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--mobile-app-btn-bg)] text-sm font-semibold text-[var(--mobile-app-btn-text)] transition-opacity active:opacity-80"
          >
            App Store
          </a>
        </div>
      </motion.div>
    </section>
  );
}
