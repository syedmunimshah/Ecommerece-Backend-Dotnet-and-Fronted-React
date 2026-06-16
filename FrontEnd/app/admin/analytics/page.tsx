import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Analytics" };
export default function Page() {
  return <AdminPlaceholder title="Analytics" description="View traffic, conversion, and user analytics." />;
}
