import type { Metadata } from "next";
import { AdminOrderDetailPageClient } from "./AdminOrderDetailPageClient";

export const metadata: Metadata = { title: "Order Details — Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminOrderDetailPageClient orderId={Number(id)} />;
}
