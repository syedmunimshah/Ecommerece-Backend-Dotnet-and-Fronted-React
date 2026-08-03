"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, LayoutDashboard, UserCircle, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/store/api/baseApi";
import { cn } from "@/lib/cn";
import { useMounted } from "@/lib/hooks/useMounted";
import { formatRoleLabel } from "@/lib/utils/role";
import { UserAvatar } from "@/components/user/UserAvatar";

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const mounted = useMounted();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, isAdmin, isSeller, role } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    setOpen(false);
    router.push("/login");
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-[var(--chip-bg)]",
          compact ? "h-9 w-9" : "h-10 w-24",
        )}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-[var(--chip-bg)]",
          compact ? "h-9 w-9" : "h-10 w-24",
        )}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={cn("flex items-center gap-2", compact && "gap-1.5")}>
        <Link
          href="/login"
          className={cn(
            "font-medium text-[var(--nav-text)] transition-colors hover:text-accent",
            compact ? "text-xs" : "hidden text-sm sm:inline",
          )}
        >
          Login
        </Link>
        <Link
          href="/register"
          className={cn(
            "rounded-full bg-[var(--product-btn-bg)] font-semibold text-[var(--product-btn-text)] transition-opacity hover:opacity-90",
            compact ? "px-3 py-1.5 text-xs" : "hidden px-4 py-2 text-sm sm:inline-flex",
          )}
        >
          Register
        </Link>
        {!compact && (
          <Link
            href="/login"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--nav-text)] sm:hidden"
            aria-label="Login"
          >
            <UserCircle className="h-5 w-5" />
          </Link>
        )}
      </div>
    );
  }

  const displayName = user?.fullName?.split(" ")[0] ?? "Account";
  const roleLabel = formatRoleLabel(role ?? user?.roleName);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-full transition-colors hover:bg-[var(--chip-bg)]",
          compact ? "p-0.5" : "bg-[var(--chip-bg)] py-1 pl-3 pr-1.5",
        )}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {!compact && (
          <span className="hidden flex-col items-end sm:flex">
            <span className="max-w-[100px] truncate text-sm font-medium text-[var(--nav-text)]">
              {displayName}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {roleLabel}
            </span>
          </span>
        )}
        {!compact && <ChevronDown className={cn("hidden h-4 w-4 text-muted transition-transform sm:block", open && "rotate-180")} />}
        <span className="relative">
          {user ? (
            <UserAvatar fullName={user.fullName} image={user.image} size="sm" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
              ?
            </span>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--nav-bg)] bg-emerald-500" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-[var(--card-bg)] py-1 shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate font-semibold text-foreground">{user?.fullName}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              {roleLabel}
            </span>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-[var(--chip-bg)]"
          >
            <LayoutDashboard className="h-4 w-4 text-muted" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-[var(--chip-bg)]"
          >
            <Settings className="h-4 w-4 text-muted" />
            Settings
          </Link>
          {isSeller && (
            <Link
              href="/dashboard/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-[var(--chip-bg)]"
            >
              <LayoutDashboard className="h-4 w-4 text-muted" />
              My Products
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-500/10"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
