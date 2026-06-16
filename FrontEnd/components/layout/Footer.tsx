import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/compare", label: "Compare" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "My Account" },
  { href: "/dashboard/orders", label: "My Orders" },
];

const SUPPORT_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
];

const POLICY_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/return-policy", label: "Return Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/60">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded bg-primary text-primary-foreground font-bold">E</span>
            <span className="text-lg font-semibold">Edge<span className="text-accent">Cart</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Pakistan&apos;s modern marketplace — shop from verified sellers with secure payments and fast delivery.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="rounded p-2 text-muted hover:bg-elevated hover:text-foreground" aria-label="Social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Shop</h3>
          <ul className="space-y-2 text-sm text-muted">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-foreground">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Account</h3>
          <ul className="space-y-2 text-sm text-muted">
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-foreground">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
          <ul className="space-y-2 text-sm text-muted">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-foreground">{l.label}</Link></li>
            ))}
            {POLICY_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-foreground">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} EdgeCart. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> support@edgecart.pk</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +92 300 1234567</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
