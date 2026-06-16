import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Order Confirmed" };

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="container-page py-20 text-center">
      <Breadcrumb items={[{ label: "Checkout", href: "/checkout" }, { label: "Success" }]} className="justify-center" />
      <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-success" />
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="mt-3 text-muted">
        {orderId ? `Order #${orderId} has been confirmed.` : "Your order has been placed successfully."}
      </p>
      <p className="mt-2 text-sm text-muted">You will receive a confirmation email shortly.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {orderId && (
          <Link href={`/dashboard/orders/${orderId}`}>
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" /> View Order
            </Button>
          </Link>
        )}
        <Link href="/products">
          <Button size="lg" variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
