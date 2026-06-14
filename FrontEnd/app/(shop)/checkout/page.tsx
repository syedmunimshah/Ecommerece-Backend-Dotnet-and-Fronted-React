import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/jwt";
import { CheckoutClient } from "@/features/orders/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/checkout");
  if (user.role !== "User") redirect("/dashboard");

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <CheckoutClient />
    </div>
  );
}
