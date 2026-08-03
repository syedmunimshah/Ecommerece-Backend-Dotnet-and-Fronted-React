"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CustomerNextSteps } from "@/components/dashboard/CustomerNextSteps";
import { useGetMyOrdersQuery } from "@/lib/store/api/api";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { Package, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { MotionButton } from "@/components/motion/MotionButton";
import { formatRoleLabel } from "@/lib/utils/role";
import { UserAvatar } from "@/components/user/UserAvatar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, role, isUser } = useAuth();
  const { data: orders } = useGetMyOrdersQuery(undefined, { skip: !isAuthenticated || !isUser });
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const orderCount = orders?.data?.length ?? 0;

  const roleLabel = formatRoleLabel(role ?? user?.roleName);

  const stats = [
    { label: "Active Orders", value: String(orderCount), icon: ShoppingBag, href: "/dashboard/orders" },
    { label: "Wishlist Items", value: String(wishlistCount), icon: Heart, href: "/wishlist" },
    { label: "Role", value: roleLabel, icon: Package, href: "/dashboard/settings" },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <PageHeader
        title={user ? `Welcome, ${user.fullName.split(" ")[0]}` : "Welcome back"}
        subtitle={user?.email}
      />

      <CustomerNextSteps />

      {user && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-[var(--card-bg)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar fullName={user.fullName} image={user.image} size="lg" />
            <div>
              <p className="text-lg font-semibold">{user.fullName}</p>
              <p className="text-sm text-muted">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-semibold text-muted">
                {roleLabel}
              </span>
            </div>
          </div>
          <MotionButton href="/dashboard/settings" variant="ghost">
            Edit Profile
          </MotionButton>
        </div>
      )}

      <AnimateIn>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-border bg-[var(--card-bg)] p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted" />
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-4 text-2xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </Link>
          ))}
        </div>
      </AnimateIn>
    </>
  );
}
