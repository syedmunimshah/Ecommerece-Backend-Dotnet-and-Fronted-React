"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User as UserIcon, LogOut, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/lib/reduxStore";
import { clearUser } from "@/features/auth/authSlice";
import { pushToast } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { CartIndicator } from "@/features/cart/CartIndicator";

export function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qc = useQueryClient();

  const onLogout = async () => {
    await fetch("/api/bff/auth/logout", { method: "POST" });
    dispatch(clearUser());
    qc.clear();
    dispatch(pushToast({ tone: "info", message: "Signed out" }));
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-primary text-primary-foreground font-bold">
            E
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Edge<span className="text-accent">Cart</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/products" className="text-muted hover:text-foreground">
            Shop
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-muted hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "Admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-muted hover:text-foreground"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/cart" aria-label="Cart" className="rounded p-2 hover:bg-elevated">
                <CartIndicator />
              </Link>
              <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/cart" aria-label="Cart" className="rounded p-2 hover:bg-elevated">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <UserIcon className="h-4 w-4" /> Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
