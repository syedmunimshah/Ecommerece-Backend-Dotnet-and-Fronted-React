"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function NavbarSearch({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <form
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const query = String(fd.get("q") ?? "").trim();
        router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
      }}
    >
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        name="q"
        type="search"
        placeholder="Search products..."
        className="h-10 w-full rounded-full border border-border bg-[var(--search-bg)] pl-4 pr-10 text-sm text-[var(--nav-text)] outline-none transition-shadow focus:ring-2 focus:ring-accent/30"
      />
    </form>
  );
}
