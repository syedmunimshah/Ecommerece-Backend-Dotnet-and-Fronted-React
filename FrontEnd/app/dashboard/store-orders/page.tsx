import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/jwt";
import { StoreOrdersManager } from "@/features/seller/StoreOrdersManager";

export const metadata: Metadata = { title: "Store Orders" };

export default async function StoreOrdersPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard/store-orders");
  if (user.role !== "Seller") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Store orders</h1>
        <p className="mt-1 text-sm text-muted">
          Orders that include products from your store.
        </p>
      </div>
      <StoreOrdersManager />
    </div>
  );
}
