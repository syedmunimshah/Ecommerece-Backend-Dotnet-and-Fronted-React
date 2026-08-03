"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NavbarSearch } from "./NavbarSearch";
import { ThemeToggle } from "@/features/ui/ThemeToggle";
import { CartBadge } from "./CartBadge";
import { WishlistNavBadge } from "./WishlistBadge";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/features/auth/useAuth";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/store/api/baseApi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/offers", label: "Offers" },
  { href: "/dashboard/become-seller", label: "For Sellers", accent: true },
];

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, user } = useAuth();

  const handleMobileLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    setMobileOpen(false);
    router.push("/login");
  };

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 32);
  });

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-[var(--nav-bg)]/95 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-nav",
      )}
    >
      <motion.div
        animate={{ height: scrolled ? 56 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="container-page lg:!h-auto"
      >
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto] items-center gap-3 transition-all duration-300 lg:grid-cols-[1fr_auto_1fr] lg:gap-4",
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-[72px]",
          )}
        >
          <div className="flex items-center">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--nav-text)] lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map(({ href, label, accent }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:opacity-80",
                    accent ? "text-seller" : "text-[var(--nav-text)]",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex justify-center">
            <Logo />
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <div className="relative hidden w-44 md:block lg:w-52">
              <NavbarSearch />
            </div>

            <ThemeToggle className="hidden lg:grid" />

            <Link
              href="/wishlist"
              className="relative hidden h-10 w-10 place-items-center rounded-full text-[var(--nav-text)] transition-colors hover:bg-[var(--chip-bg)] lg:grid"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <WishlistNavBadge />
            </Link>

            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[var(--nav-text)] transition-colors hover:bg-[var(--chip-bg)]"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </Link>

            <div className="mx-0.5 hidden h-6 w-px bg-border sm:block" />

            {/* Mobile avatar / menu */}
            <div className="lg:hidden">
              <UserMenu compact />
            </div>

            {/* Desktop user menu */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <div className="container-page space-y-4 py-4">
              <NavbarSearch />
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.map(({ href, label, accent }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-sm font-medium",
                      accent ? "text-seller" : "text-[var(--nav-text)]",
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                {isAuthenticated && user ? (
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-[var(--chip-bg)] p-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-bold text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{user.fullName}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <ThemeToggle />
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[var(--nav-text)]"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[var(--nav-text)]"
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleMobileLogout}
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[var(--nav-text)]"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-full bg-[var(--product-btn-bg)] px-4 py-1.5 text-sm font-semibold text-[var(--product-btn-text)]"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
