"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { FlashSaleProduct } from "@/lib/content/home";
import { formatRs } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";

export function FlashSaleCard({ product }: { product: FlashSaleProduct }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl bg-[var(--flash-card-bg)] shadow-lg sm:w-auto"
    >
      <div className="relative aspect-square bg-white/50 p-3 dark:bg-black/20">
        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {product.badge}
        </span>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="220px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--flash-card-text)]">
          {product.name}
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-[var(--flash-card-text)]">
            {formatRs(product.price)}
          </span>
          <span className="text-xs text-muted line-through">
            {formatRs(product.originalPrice)}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--flash-btn-bg)] text-sm font-semibold text-[var(--flash-btn-text)] transition-opacity hover:opacity-90"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
