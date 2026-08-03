import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, link = true }: { className?: string; link?: boolean }) {
  const content = (
    <>
      {/* Mobile — rounded square mark */}
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-[var(--nav-text)] lg:hidden">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="var(--nav-bg)" />
        </svg>
      </span>

      {/* Desktop — diamond mark */}
      <span className="relative hidden h-9 w-9 place-items-center lg:grid">
        <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden>
          <path d="M18 2 L34 18 L18 34 L2 18 Z" className="fill-[var(--nav-text)]" />
          <path d="M18 10 L26 18 L18 26 L10 18 Z" className="fill-[var(--nav-bg)]" />
          <path d="M18 14 L22 18 L18 22 L14 18 Z" className="fill-[var(--nav-text)]" />
        </svg>
      </span>

      <span className="text-lg font-bold tracking-tight text-[var(--nav-text)] lg:text-xl">
        EdgeCart
      </span>
    </>
  );

  if (!link) {
    return <span className={cn("flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      {content}
    </Link>
  );
}
