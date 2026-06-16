"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, GitCompare, ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/lib/reduxStore";
import { bffApi } from "@/services/api";
import type { ProductDto } from "@/types/product";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/format";
import { AddToCartButton } from "@/features/products/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/WishlistButton";

export default function WishlistPage() {
  const ids = useAppSelector((s) => s.wishlist.productIds);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      ids.map((id) =>
        bffApi.get<ProductDto>(`/products/${id}`).then((r) => r.data).catch(() => null),
      ),
    ).then((results) => {
      setProducts(results.filter(Boolean) as ProductDto[]);
      setLoading(false);
    });
  }, [ids]);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-16 w-16" />}
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.Id} className="card relative overflow-hidden">
              <div className="absolute right-2 top-2 z-10">
                <WishlistButton productId={p.Id} />
              </div>
              <Link href={`/products/${p.Id}`}>
                <div className="relative h-48 bg-elevated">
                  {p.Image ? (
                    <Image src={p.Image} alt={p.Name} fill className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center"><ShoppingCart className="h-12 w-12 text-muted opacity-30" /></div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${p.Id}`}>
                  <h3 className="font-semibold hover:text-accent line-clamp-2">{p.Name}</h3>
                </Link>
                <p className="mt-2 text-lg font-bold text-accent">{formatCurrency(p.Price)}</p>
                <div className="mt-3">
                  <AddToCartButton productId={p.Id} stock={p.Stock} fullWidth />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
