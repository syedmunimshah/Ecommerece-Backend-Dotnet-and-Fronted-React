import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Product Management" };

export default function AdminProductsPage() {
  return (
    <AdminPlaceholder
      title="Product Management"
      description="View and manage all products across the marketplace."
    />
  );
}
