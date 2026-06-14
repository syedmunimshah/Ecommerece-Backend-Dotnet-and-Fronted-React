"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    return `?${next.toString()}`;
  };

  const cls = (active: boolean, disabled = false) =>
    cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded border px-2 text-sm",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-surface text-foreground hover:bg-elevated",
      disabled && "pointer-events-none opacity-40",
    );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) =>
    Math.abs(p - page) < 3 || p === 1 || p === totalPages,
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      <Link href={buildHref(Math.max(1, page - 1))} className={cls(false, page === 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showGap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="contents">
            {showGap && <span className="px-1 text-muted">…</span>}
            <Link href={buildHref(p)} className={cls(p === page)}>
              {p}
            </Link>
          </span>
        );
      })}
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        className={cls(false, page === totalPages)}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
