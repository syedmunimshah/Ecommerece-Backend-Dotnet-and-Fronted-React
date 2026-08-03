"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  FolderTree,
  ShoppingBag,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/store/api/baseApi";
import { useAuth } from "@/features/auth/useAuth";
import { useMounted } from "@/lib/hooks/useMounted";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Seller Approval", icon: Store },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "All Orders", icon: ShoppingBag },
  { href: "/admin/roles", label: "Roles", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useMounted();
  const { user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  if (!mounted) {
    return (
      <aside className="lg:w-56 lg:shrink-0">
        <div className="rounded-2xl border border-orange-500/20 bg-[var(--card-bg)] p-4 lg:sticky lg:top-24">
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-[var(--chip-bg)]" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-[var(--chip-bg)]" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="lg:w-56 lg:shrink-0">
      <div className="rounded-2xl border border-orange-500/20 bg-[var(--card-bg)] p-4 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-2 px-3">
          <Shield className="h-4 w-4 text-orange-500" />
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Admin Panel
          </p>
        </div>
        {user && (
          <p className="mb-4 truncate px-3 text-xs text-muted">{user.fullName}</p>
        )}
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-orange-500 text-white"
                    : "text-muted hover:bg-[var(--chip-bg)] hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/dashboard"
          className="mt-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-[var(--chip-bg)]"
        >
          ← Customer Dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
