import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, ShoppingBag, Store } from "lucide-react";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listMyOrders } from "@/services/order.service";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Dashboard Overview" };

export default async function DashboardOverviewPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard/overview");

  const token = (await getServerToken())!;
  const orders = await listMyOrders(token, 1, 5).catch(() => null);

  const stats = [
    { label: "Total Orders", value: orders?.TotalRecords ?? 0, icon: Package, href: "/dashboard/orders" },
    { label: "Wishlist", value: "—", icon: Heart, href: "/dashboard/wishlist" },
    { label: "Recent Orders", value: orders?.Data.length ?? 0, icon: ShoppingBag, href: "/dashboard/orders" },
  ];

  if (user.role === "Seller") {
    stats.push({ label: "My Store", value: "Active", icon: Store, href: "/dashboard/products" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-glow">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{String(value)}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {orders && orders.Data.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Recent Orders</h2>
          <ul className="space-y-3">
            {orders.Data.map((o) => (
              <li key={o.Id} className="flex items-center justify-between text-sm">
                <Link href={`/dashboard/orders/${o.Id}`} className="hover:text-accent">
                  Order #{o.Id}
                </Link>
                <span className="text-muted">{o.Status}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
