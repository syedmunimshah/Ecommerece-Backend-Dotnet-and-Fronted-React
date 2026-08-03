"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { WishlistBadge } from "./WishlistBadge";
import { useAuth } from "@/features/auth/useAuth";
import { useMounted } from "@/lib/hooks/useMounted";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/products", label: "Search", icon: Search, match: (p: string) => p.startsWith("/products") || p.startsWith("/search") },
  { href: "/dashboard/become-seller", label: "Sell", icon: PlusSquare, match: (p: string) => p.includes("become-seller") || p.includes("dashboard/products") },
  { href: "/wishlist", label: "Wishlist", icon: Heart, match: (p: string) => p.startsWith("/wishlist"), showBadge: true },
  {
    href: "/dashboard",
    label: "Profile",
    icon: User,
    match: (p: string) =>
      p.startsWith("/dashboard") ||
      p.startsWith("/login") ||
      p.startsWith("/register"),
    authOnly: false,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const mounted = useMounted();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-[var(--nav-bg)] pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-stretch">
        {NAV_ITEMS.map(({ href, label, icon: Icon, match, showBadge }) => {
          const active = match(pathname);
          const profileHref = label === "Profile" && mounted && !isAuthenticated ? "/login" : href;
          const profileLabel = label === "Profile" && mounted && !isAuthenticated ? "Login" : label;

          return (
            <Link
              key={href}
              href={profileHref}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted",
              )}
            >
              <span className="relative">
                <Icon
                  className={cn("h-5 w-5", active && "stroke-[2.5px]")}
                  strokeWidth={active ? 2.5 : 1.75}
                />
                {showBadge && <WishlistBadge />}
              </span>
              {profileLabel}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
