"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProductSearchBar({ placeholder = "Search products..." }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const categoryId = params.get("categoryId");

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const query = String(fd.get("q") ?? "").trim();
        const search = new URLSearchParams();
        if (query) search.set("q", query);
        if (categoryId) search.set("categoryId", categoryId);
        const qs = search.toString();
        router.push(qs ? `/products?${qs}` : "/products");
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-[var(--card-bg)] pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-accent/30"
      />
    </form>
  );
}

export function CategoryPills({
  activeCategoryId,
  categories,
}: {
  activeCategoryId?: number;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q");

  const navigate = (categoryId?: number) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (categoryId) search.set("categoryId", String(categoryId));
    const qs = search.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => navigate()}
        className={cn(
          "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
          !activeCategoryId
            ? "border-transparent bg-[var(--product-btn-bg)] text-[var(--product-btn-text)]"
            : "border-border bg-[var(--card-bg)] text-muted hover:text-foreground",
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => navigate(c.id)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            activeCategoryId === c.id
              ? "border-transparent bg-[var(--product-btn-bg)] text-[var(--product-btn-text)]"
              : "border-border bg-[var(--card-bg)] text-muted hover:text-foreground",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
