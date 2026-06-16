"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useAppSelector } from "@/lib/reduxStore";
import { bffApi } from "@/services/api";
import type { ProductDto } from "@/types/product";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/format";

export default function DashboardWishlistPage() {
  const ids = useAppSelector((s) => s.wishlist.productIds);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) { setProducts([]); setLoading(false); return; }
    Promise.all(ids.map((id) => bffApi.get<ProductDto>(`/products/${id}`).then((r) => r.data).catch(() => null)))
      .then((r) => { setProducts(r.filter(Boolean) as ProductDto[]); setLoading(false); });
  }, [ids]);

  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!products.length) {
    return (
      <EmptyState icon={<Heart className="h-16 w-16" />} title="No saved items" actionLabel="Browse Products" actionHref="/products" />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <Link key={p.Id} href={`/products/${p.Id}`} className="card flex gap-4 p-4 hover:shadow-glow">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-elevated">
              {p.Image && <Image src={p.Image} alt={p.Name} fill className="object-cover" />}
            </div>
            <div>
              <p className="font-medium">{p.Name}</p>
              <p className="text-accent font-bold">{formatCurrency(p.Price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
