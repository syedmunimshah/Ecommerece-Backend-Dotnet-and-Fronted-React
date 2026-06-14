import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted md:flex-row">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">EdgeCart</span> — built on Next.js & .NET
        </p>
        <div className="flex gap-5">
          <Link href="/products" className="hover:text-foreground">Shop</Link>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link href="/login" className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}
