import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Store, Package, Tag } from "lucide-react";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listUsers } from "@/services/auth.service";
import { listAllOrders } from "@/services/order.service";
import { listPendingSellers } from "@/services/sellerProfile.service";
import { listCategories } from "@/services/category.service";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const [users, orders, pendingSellers, categories] = await Promise.allSettled([
    listUsers(token, 1, 1),
    listAllOrders(token, 1, 1),
    listPendingSellers(token, 1, 1),
    listCategories(1, 1, token),
  ]);

  const stats = [
    {
      label: "Total users",
      value: users.status === "fulfilled" ? users.value.TotalRecords : "—",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Pending sellers",
      value: pendingSellers.status === "fulfilled" ? pendingSellers.value.TotalRecords : "—",
      icon: Store,
      href: "/admin/sellers",
      highlight: pendingSellers.status === "fulfilled" && pendingSellers.value.TotalRecords > 0,
    },
    {
      label: "Total orders",
      value: orders.status === "fulfilled" ? orders.value.TotalRecords : "—",
      icon: Package,
      href: "/admin/orders",
    },
    {
      label: "Categories",
      value: categories.status === "fulfilled" ? categories.value.TotalRecords : "—",
      icon: Tag,
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, highlight }) => (
          <Link key={label} href={href}>
            <Card className={`flex items-center gap-4 transition-shadow hover:shadow-glow ${highlight ? "ring-1 ring-warning/50" : ""}`}>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${highlight ? "bg-warning/15" : "bg-primary/15"}`}>
                <Icon className={`h-5 w-5 ${highlight ? "text-warning" : "text-accent"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{String(value)}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
