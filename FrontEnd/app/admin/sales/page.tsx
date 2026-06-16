import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listAllOrders } from "@/services/order.service";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = { title: "Sales Statistics" };

export default async function SalesPage() {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const orders = await listAllOrders(token, 1, 100).catch(() => null);
  const totalRevenue = orders?.Data.reduce((s, o) => s + o.TotalAmount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales & Revenue Statistics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted">Total Orders</p>
          <p className="text-3xl font-bold">{orders?.TotalRecords ?? 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted">Total Revenue</p>
          <p className="text-3xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted">Avg Order Value</p>
          <p className="text-3xl font-bold">
            {orders?.Data.length ? formatCurrency(totalRevenue / orders.Data.length) : "—"}
          </p>
        </Card>
      </div>
    </div>
  );
}
