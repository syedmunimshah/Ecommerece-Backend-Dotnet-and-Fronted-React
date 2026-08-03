"use client";

import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { OrderDetailView } from "@/components/order/OrderDetailView";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function OrderDetailPageClient({ orderId }: { orderId: number }) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Orders", href: "/dashboard/orders" },
          { label: `Order #${orderId}` },
        ]}
      />
      <PageHeader title={`Order #${orderId}`} subtitle="Order details and tracking" />
      <AnimateIn>
        <OrderDetailView
          orderId={orderId}
          backHref="/dashboard/orders"
          backLabel="My Orders"
        />
      </AnimateIn>
    </>
  );
}
