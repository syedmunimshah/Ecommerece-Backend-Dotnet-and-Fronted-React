"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  defaultValue = "",
  className,
  placeholder = "Search products, brands, categories…",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push("/products");
  };

  return (
    <form onSubmit={onSubmit} className={cn("relative flex-1", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input-base h-10 w-full pl-9 pr-4"
        aria-label="Search products"
      />
    </form>
  );
}
