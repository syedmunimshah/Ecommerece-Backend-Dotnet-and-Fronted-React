"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { useTransition } from "react";
import type { CategoryDto } from "@/types/category";
import { cn } from "@/lib/cn";

export function ProductFilters({
  categories,
}: {
  categories: CategoryDto[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeCategory = params.get("category") ?? "";
  const search = params.get("q") ?? "";
  const sort = params.get("sort") ?? "";
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const view = params.get("view") ?? "grid";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => router.push(`?${next.toString()}`));
  };

  return (
    <div className={cn("space-y-4", isPending && "opacity-60 transition-opacity")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="input-base pl-9 pr-9"
            placeholder="Search products…"
            defaultValue={search}
            onChange={(e) => update("q", e.target.value)}
          />
          {search && (
            <button
              onClick={() => update("q", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="input-base w-full lg:w-44"
          aria-label="Sort products"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>

        <div className="flex gap-1 rounded border border-border p-1">
          <button
            type="button"
            onClick={() => update("view", "grid")}
            className={cn("rounded p-2", view !== "list" ? "bg-primary/15 text-accent" : "text-muted")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => update("view", "list")}
            className={cn("rounded p-2", view === "list" ? "bg-primary/15 text-accent" : "text-muted")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-muted">Price:</span>
        <input
          type="number"
          placeholder="Min"
          defaultValue={min}
          onBlur={(e) => update("min", e.target.value)}
          className="input-base w-24"
        />
        <span className="text-muted">—</span>
        <input
          type="number"
          placeholder="Max"
          defaultValue={max}
          onBlur={(e) => update("max", e.target.value)}
          className="input-base w-24"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update("category", "")}
            className={cn(
              "rounded border px-3 py-1.5 text-xs font-medium transition-colors",
              !activeCategory
                ? "border-primary bg-primary/15 text-accent"
                : "border-border bg-surface text-muted hover:bg-elevated",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.Id}
              onClick={() =>
                update("category", activeCategory === String(c.Id) ? "" : String(c.Id))
              }
              className={cn(
                "rounded border px-3 py-1.5 text-xs font-medium transition-colors",
                activeCategory === String(c.Id)
                  ? "border-primary bg-primary/15 text-accent"
                  : "border-border bg-surface text-muted hover:bg-elevated",
              )}
            >
              {c.Name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
