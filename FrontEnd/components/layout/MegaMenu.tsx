"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Tag, Store } from "lucide-react";
import type { CategoryDto } from "@/types/category";
import { cn } from "@/lib/cn";

export function MegaMenu({ categories }: { categories: CategoryDto[] }) {
  const [open, setOpen] = useState(false);
  const active = categories.filter((c) => c.IsActive).slice(0, 8);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        aria-expanded={open}
      >
        Categories <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[640px] rounded-lg border border-border bg-surface p-6 shadow-glow">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <Tag className="h-3.5 w-3.5" /> Shop by Category
              </p>
              <ul className="space-y-2">
                {active.map((c) => (
                  <li key={c.Id}>
                    <Link
                      href={`/categories/${c.Id}`}
                      className="text-sm hover:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      {c.Name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/categories" className="text-sm font-medium text-accent hover:underline">
                    View all categories →
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <Store className="h-3.5 w-3.5" /> Quick Links
              </p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products?sort=newest" className="hover:text-accent">New Arrivals</Link></li>
                <li><Link href="/products?sort=price-asc" className="hover:text-accent">Best Deals</Link></li>
                <li><Link href="/products" className="hover:text-accent">All Products</Link></li>
                <li><Link href="/dashboard/become-seller" className="hover:text-accent">Sell on EdgeCart</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
