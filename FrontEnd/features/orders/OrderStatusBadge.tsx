import { Badge } from "@/components/ui/Badge";

const STATUS_TONE: Record<string, "success" | "warning" | "destructive" | "primary" | "default"> =
  {
    Pending: "warning",
    Processing: "primary",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "destructive",
  };

export function OrderStatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "default";
  return <Badge tone={tone}>{status}</Badge>;
}
