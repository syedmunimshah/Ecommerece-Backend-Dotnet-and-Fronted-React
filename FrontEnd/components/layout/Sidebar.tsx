"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

export interface SidebarItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export function Sidebar({ items, title }: { items: SidebarItem[]; title: string }) {
  const pathname = usePathname();
  return (
    <aside className="card sticky top-20 h-fit w-full p-4 lg:w-64">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-2 text-sm",
                active
                  ? "bg-primary/15 text-accent"
                  : "text-foreground/80 hover:bg-elevated",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
