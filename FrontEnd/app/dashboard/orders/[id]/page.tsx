import type { Metadata } from "next";
import { OrderDetailPageClient } from "./OrderDetailPageClient";

export const metadata: Metadata = { title: "Order Details" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailPageClient orderId={Number(id)} />;
}
