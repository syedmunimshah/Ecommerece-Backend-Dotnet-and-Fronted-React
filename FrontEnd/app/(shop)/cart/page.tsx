import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/jwt";
import { CartPageClient } from "@/features/cart/CartPageClient";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/cart");

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-3xl font-bold">Your cart</h1>
      <CartPageClient />
    </div>
  );
}
