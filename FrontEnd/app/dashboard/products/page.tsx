import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/jwt";
import { SellerProductsManager } from "@/features/seller/SellerProductsManager";

export const metadata: Metadata = { title: "My Products" };

export default async function SellerProductsPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/dashboard/products");
  if (user.role !== "Seller") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Product management</h1>
        <p className="mt-1 text-sm text-muted">
          Create, edit, and manage products in your store.
        </p>
      </div>
      <SellerProductsManager />
    </div>
  );
}
