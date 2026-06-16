import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Reviews Management" };
export default function Page() {
  return <AdminPlaceholder title="Reviews Management" description="Moderate and manage product reviews." />;
}
