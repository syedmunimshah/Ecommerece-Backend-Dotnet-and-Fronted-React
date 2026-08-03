import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="mb-3 h-1 w-12 rounded-full bg-accent-gradient" />
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[var(--card-bg)] px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-[var(--product-btn-bg)] px-6 text-sm font-semibold text-[var(--product-btn-text)]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
