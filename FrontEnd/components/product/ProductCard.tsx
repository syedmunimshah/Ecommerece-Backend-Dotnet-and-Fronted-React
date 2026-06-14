import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { ProductDto } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/features/products/AddToCartButton";

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <div className="card group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-glow">
      <Link href={`/products/${product.Id}`} className="block">
        <div className="relative h-48 bg-elevated">
          {product.Image ? (
            <Image
              src={product.Image}
              alt={product.Name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            />
          ) : (
            <div className="grid h-full place-items-center text-muted">
              <ShoppingCart className="h-12 w-12 opacity-30" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.CategoryName && (
          <Badge tone="primary" className="self-start">
            {product.CategoryName}
          </Badge>
        )}
        <Link href={`/products/${product.Id}`}>
          <h3 className="font-semibold leading-snug hover:text-accent line-clamp-2">
            {product.Name}
          </h3>
        </Link>
        {product.SellerName && (
          <p className="text-xs text-muted">by {product.SellerName}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-accent">
            {formatCurrency(product.Price)}
          </span>
          <AddToCartButton productId={product.Id} stock={product.Stock} />
        </div>
      </div>
    </div>
  );
}
