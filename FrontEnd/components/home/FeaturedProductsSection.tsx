"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FEATURED_PRODUCTS,
  FEATURED_TABS,
  type FeaturedTab,
} from "@/lib/content/home";
import { FeaturedProductCard } from "@/components/product/FeaturedProductCard";
import { cn } from "@/lib/cn";

export function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState<FeaturedTab>("best-sellers");

  const filtered = FEATURED_PRODUCTS.filter((p) => p.tabs.includes(activeTab));

  return (
    <section className="hidden bg-background py-14 sm:py-20 lg:block">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted sm:text-base">
              Hand-picked premium selections just for you
            </p>
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {FEATURED_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === id
                    ? "border-transparent bg-[var(--product-btn-bg)] text-[var(--product-btn-text)]"
                    : "border-border bg-[var(--card-bg)] text-foreground hover:bg-surface",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {filtered.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/products"
            className="inline-flex h-12 min-w-[240px] items-center justify-center rounded-full border border-border bg-[var(--card-bg)] px-8 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
