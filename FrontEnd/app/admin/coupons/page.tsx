import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Coupons" };
export default function Page() {
  return <AdminPlaceholder title="Coupons Management" description="Create and manage discount coupons." />;
}
