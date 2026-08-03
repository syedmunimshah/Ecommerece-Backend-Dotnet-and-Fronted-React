"use client";

import { ProductImage } from "@/components/product/ProductImage";
import Link from "next/link";
import { ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { formatRs } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/features/cart/CartProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { MotionButton } from "@/components/motion/MotionButton";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const [qty, setQty] = useState(1);
  const wished = has(product.id);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
      >
        <ProductImage src={product.image} alt={product.name} fill className="object-cover" priority />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--product-badge-bg)] px-3 py-1 text-xs font-semibold text-[var(--product-badge-text)]">
            {product.badge}
          </span>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{product.category}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{product.name}</h1>
        <div className="mt-3">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatRs(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-muted line-through">{formatRs(product.originalPrice)}</span>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
        <p className="mt-2 text-sm text-muted">Sold by <strong className="text-foreground">{product.seller}</strong></p>
        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">{product.stock} in stock</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-border">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <MotionButton
            className="flex-1 gap-2"
            onClick={() => addItem(product, qty)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </MotionButton>
          <button
            type="button"
            onClick={() => toggle(product.id)}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl border border-border",
              wished && "border-red-500/50 bg-red-500/10",
            )}
          >
            <Heart className={cn("h-5 w-5", wished ? "fill-red-500 text-red-500" : "text-muted")} />
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[var(--card-bg)] p-4 text-sm">
            <Truck className="h-5 w-5 text-muted" />
            Free delivery over Rs. 3,500
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-[var(--card-bg)] p-4 text-sm">
            <ShieldCheck className="h-5 w-5 text-muted" />
            SafePay protection
          </div>
        </div>

        <Link href="/cart" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          View cart →
        </Link>
      </motion.div>
    </div>
  );
}
