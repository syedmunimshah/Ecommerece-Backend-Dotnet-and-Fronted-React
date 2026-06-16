"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitCompare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { removeFromCompare, clearCompare } from "@/features/compare/compareSlice";
import { bffApi } from "@/services/api";
import type { ProductDto } from "@/types/product";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/format";

export default function ComparePage() {
  const ids = useAppSelector((s) => s.compare.productIds);
  const dispatch = useAppDispatch();
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

  const rows: { label: string; key: keyof ProductDto }[] = [
    { label: "Price", key: "Price" },
    { label: "Stock", key: "Stock" },
    { label: "Category", key: "CategoryName" },
    { label: "Seller", key: "SellerName" },
    { label: "Description", key: "Description" },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Compare Products" }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Compare Products</h1>
        {products.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => dispatch(clearCompare())}>
            Clear all
          </Button>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<GitCompare className="h-16 w-16" />}
          title="No products to compare"
          description="Add up to 4 products to compare their features side by side."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-elevated p-4 text-left">Feature</th>
                {products.map((p) => (
                  <th key={p.Id} className="border border-border bg-elevated p-4 text-left">
                    <Link href={`/products/${p.Id}`} className="font-semibold hover:text-accent">
                      {p.Name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => dispatch(removeFromCompare(p.Id))}
                    >
                      Remove
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, key }) => (
                <tr key={label}>
                  <td className="border border-border p-4 font-medium">{label}</td>
                  {products.map((p) => (
                    <td key={p.Id} className="border border-border p-4">
                      {key === "Price"
                        ? formatCurrency(p.Price)
                        : String(p[key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
