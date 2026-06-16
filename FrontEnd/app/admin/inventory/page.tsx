import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Inventory" };
export default function Page() {
  return <AdminPlaceholder title="Inventory Management" description="Track stock levels across all products." />;
}
