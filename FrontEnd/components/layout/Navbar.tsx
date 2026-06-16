"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Shield,
  Heart,
  GitCompare,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { clearUser } from "@/features/auth/authSlice";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { CartIndicator } from "@/features/cart/CartIndicator";
import { SearchBar } from "@/components/layout/SearchBar";
import { MegaMenuClient } from "@/components/layout/MegaMenuClient";
import { ThemeToggle } from "@/features/ui/ThemeToggle";
import { easeOut } from "@/lib/motion";

export function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const wishlistCount = useAppSelector((s) => s.wishlist.productIds.length);
  const compareCount = useAppSelector((s) => s.compare.productIds.length);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = async () => {
    await fetch("/api/bff/auth/logout", { method: "POST" });
    dispatch(clearUser());
    qc.clear();
    dispatch(pushToast({ tone: "info", message: "Signed out" }));
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: easeOut }}
      className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md"
    >
      <div className="border-b border-border/50 bg-primary/10 py-1.5 text-center text-xs text-muted">
        Free shipping on orders over Rs. 5,000 · Same-day dispatch available
      </div>

      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-primary text-primary-foreground font-bold">
            E
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            Edge<span className="text-accent">Cart</span>
          </span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="hidden items-center gap-5 text-sm lg:flex">
          <Link href="/products" className="nav-link">Shop</Link>
          <MegaMenuClient />
          <Link href="/blog" className="nav-link">Blog</Link>
          {user && (
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
          )}
          {user?.role === "Admin" && (
            <Link href="/admin" className="inline-flex items-center gap-1 text-muted hover:text-foreground">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          <Link href="/wishlist" aria-label="Wishlist" className="relative rounded p-2 hover:bg-elevated">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/compare" aria-label="Compare" className="relative hidden rounded p-2 hover:bg-elevated sm:block">
            <GitCompare className="h-5 w-5" />
            {compareCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link href="/cart" aria-label="Cart" className="rounded p-2 hover:bg-elevated">
                <CartIndicator />
              </Link>
              <span className="hidden max-w-[120px] truncate text-sm text-muted xl:inline">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={onLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/cart" aria-label="Cart" className="rounded p-2 hover:bg-elevated">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <UserIcon className="h-4 w-4" /> Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}

          <button
            type="button"
            className="rounded p-2 hover:bg-elevated lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden border-t border-border bg-surface lg:hidden"
          >
            <div className="p-4">
              <SearchBar className="mb-4" />
              <nav className="flex flex-col gap-3 text-sm">
                <Link href="/products" onClick={() => setMobileOpen(false)}>Shop</Link>
                <Link href="/categories" onClick={() => setMobileOpen(false)}>Categories</Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                <Link href="/compare" onClick={() => setMobileOpen(false)}>Compare</Link>
                <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
                {user && <Link href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
                {user?.role === "Admin" && <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
                {!user && <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
