"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { baseApi } from "@/lib/store/api/baseApi";
import { useAuth } from "@/features/auth/useAuth";
import { useMounted } from "@/lib/hooks/useMounted";
import { formatRoleLabel } from "@/lib/utils/role";
import { UserAvatar } from "@/components/user/UserAvatar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useMounted();
  const { user, isSeller, isAdmin, role } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, show: true },
    { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag, show: true },
    {
      href: "/dashboard/products",
      label: "My Products",
      icon: Package,
      show: isSeller,
    },
    {
      href: "/dashboard/store-orders",
      label: "Store Orders",
      icon: ShoppingBag,
      show: isSeller,
    },
    {
      href: "/dashboard/become-seller",
      label: "Become a Seller",
      icon: Store,
      show: !isSeller,
    },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, show: true },
  ];

  if (!mounted) {
    return (
      <aside className="lg:w-56 lg:shrink-0">
        <div className="rounded-2xl border border-border bg-[var(--card-bg)] p-4 lg:sticky lg:top-24">
          <div className="mb-4 space-y-2 border-b border-border px-3 pb-4">
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--chip-bg)]" />
            <div className="h-3 w-32 animate-pulse rounded bg-[var(--chip-bg)]" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-[var(--chip-bg)]" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="lg:w-56 lg:shrink-0">
      <div className="rounded-2xl border border-border bg-[var(--card-bg)] p-4 lg:sticky lg:top-24">
        {user && (
          <div className="mb-4 border-b border-border px-3 pb-4">
            <div className="flex items-center gap-3">
              <UserAvatar fullName={user.fullName} image={user.image} size="md" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.fullName}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[10px] font-bold uppercase">
              {formatRoleLabel(role ?? user.roleName)}
            </span>
          </div>
        )}
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {links
            .filter((l) => l.show)
            .map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--product-btn-bg)] text-[var(--product-btn-text)]"
                      : "text-muted hover:bg-[var(--chip-bg)] hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
        </nav>
        {isAdmin && (
          <Link
            href="/admin"
            className="mt-4 flex items-center gap-2.5 rounded-xl bg-orange-500/10 px-3 py-2.5 text-sm font-medium text-orange-600"
          >
            <Shield className="h-4 w-4" />
            Admin Panel
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
