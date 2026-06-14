"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
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

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    startTransition(() => router.push(`?${next.toString()}`));
  };

  return (
    <div className={cn("space-y-4", isPending && "opacity-60 transition-opacity")}>
      {/* Search */}
      <div className="relative">
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

      {/* Categories */}
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
