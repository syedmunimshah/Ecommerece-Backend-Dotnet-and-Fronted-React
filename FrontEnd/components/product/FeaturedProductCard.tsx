"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { FeaturedProduct } from "@/lib/content/home";
import { formatRs } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/cn";

export function FeaturedProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-[var(--card-bg)]"
    >
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--product-badge-bg)] px-2.5 py-1 text-[10px] font-semibold text-[var(--product-badge-text)]">
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {product.category}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-foreground">
            {formatRs(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              {formatRs(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          className={cn(
            "mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90",
            "bg-[var(--product-btn-bg)] text-[var(--product-btn-text)]",
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
