"use client";

import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { OrderDetailView } from "@/components/order/OrderDetailView";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function AdminOrderDetailPageClient({ orderId }: { orderId: number }) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: `Order #${orderId}` },
        ]}
      />
      <PageHeader title={`Order #${orderId}`} subtitle="Order details and status management" />
      <AnimateIn>
        <OrderDetailView
          orderId={orderId}
          backHref="/admin/orders"
          backLabel="All Orders"
        />
      </AnimateIn>
    </>
  );
}
