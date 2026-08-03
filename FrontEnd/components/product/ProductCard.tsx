"use client";

import { ProductImage } from "@/components/product/ProductImage";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { formatRs } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { useCart } from "@/features/cart/CartProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { cn } from "@/lib/cn";
import { hoverLift, springTransition } from "@/lib/motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <motion.article
      whileHover={hoverLift}
      transition={springTransition}
      className="card-elevated group flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--card-bg)]"
    >
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-[var(--product-badge-bg)] px-2.5 py-1 text-[10px] font-semibold text-[var(--product-badge-text)] shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="w-fit rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-[var(--card-bg)]/80 shadow-sm backdrop-blur transition-transform hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-red-500 text-red-500" : "text-muted")} />
        </button>
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-accent">{product.name}</h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold">{formatRs(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">{formatRs(product.originalPrice)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="btn-accent mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <p className="py-12 text-center text-muted">No products found.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
