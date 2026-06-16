"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { ProductDto } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/features/products/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { hoverLift, springTransition, tapScale } from "@/lib/motion";

function CardInner({ product }: { product: ProductDto }) {
  return (
    <>
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton productId={product.Id} />
      </div>
      <Link href={`/products/${product.Id}`} className="block overflow-hidden">
        <div className="relative h-48 bg-elevated">
          {product.Image ? (
            <Image
              src={product.Image}
              alt={product.Name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          ) : (
            <div className="grid h-full place-items-center text-muted">
              <ShoppingCart className="h-12 w-12 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.CategoryName && (
          <Badge tone="primary" className="self-start">{product.CategoryName}</Badge>
        )}
        <Link href={`/products/${product.Id}`}>
          <h3 className="font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-accent">
            {product.Name}
          </h3>
        </Link>
        {product.SellerName && <p className="text-xs text-muted">by {product.SellerName}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-accent">{formatCurrency(product.Price)}</span>
          <AddToCartButton productId={product.Id} stock={product.Stock} />
        </div>
      </div>
    </>
  );
}

export function ProductCard({
  product,
  animated = false,
}: {
  product: ProductDto;
  index?: number;
  animated?: boolean;
}) {
  const cardClass = "card-interactive group relative flex h-full flex-col overflow-hidden p-0";

  if (!animated) {
    return (
      <div className={cardClass}>
        <CardInner product={product} />
      </div>
    );
  }

  return (
    <motion.div
      className={cardClass}
      whileHover={hoverLift}
      whileTap={tapScale}
      transition={springTransition}
    >
      <CardInner product={product} />
    </motion.div>
  );
}
