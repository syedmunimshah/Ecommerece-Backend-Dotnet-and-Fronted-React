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

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

  // Preselect the first option that is actually in stock, so the common case is one click.
  // Nothing is selected if every option is sold out — Add to Cart is disabled either way.
  const [variantId, setVariantId] = useState<number | null>(
    () => variants.find((v) => v.stock > 0)?.id ?? null,
  );
  const selected = variants.find((v) => v.id === variantId) ?? null;

  // With options, price and stock come from the chosen one; the product's own figures are
  // only the "from" price and the combined stock.
  const price = selected?.price ?? product.price;
  const available = selected?.stock ?? product.stock;
  const canAdd = available > 0 && (!hasVariants || selected !== null);

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
          {hasVariants && !selected && (
            <span className="text-sm font-medium text-muted">from</span>
          )}
          <span className="text-3xl font-bold">{formatRs(price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-muted line-through">{formatRs(product.originalPrice)}</span>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
        <p className="mt-2 text-sm text-muted">Sold by <strong className="text-foreground">{product.seller}</strong></p>

        {hasVariants && (
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">
              Options
              {selected && <span className="ml-2 font-normal text-muted">{selected.name}</span>}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variants.map((variant) => {
                const soldOut = variant.stock <= 0;
                const isSelected = variant.id === variantId;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    // A sold-out option stays visible but unpickable: hiding it makes the
                    // product look like it was never offered in that size.
                    disabled={soldOut}
                    onClick={() => {
                      setVariantId(variant.id);
                      setQty(1);
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm transition",
                      isSelected
                        ? "border-accent bg-accent/10 font-semibold text-accent"
                        : "border-border text-foreground hover:border-accent",
                      soldOut && "cursor-not-allowed line-through opacity-40 hover:border-border",
                    )}
                  >
                    {variant.name}
                    <span className="ml-2 text-xs text-muted">{formatRs(variant.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p
          className={cn(
            "mt-3 text-sm",
            available > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600",
          )}
        >
          {available > 0
            ? `${available} in stock${hasVariants && selected ? ` (${selected.name})` : ""}`
            : "Out of stock"}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-border">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              // Capped at what is actually available, so the API's stock rejection is the
              // backstop rather than the first thing the customer runs into.
              onClick={() => setQty((q) => Math.min(available, q + 1))}
              disabled={qty >= available}
              className="grid h-10 w-10 place-items-center disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <MotionButton
            className="flex-1 gap-2"
            disabled={!canAdd}
            onClick={() => addItem(product, qty, variantId)}
          >
            <ShoppingCart className="h-4 w-4" />
            {available > 0 ? "Add to Cart" : "Out of stock"}
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
