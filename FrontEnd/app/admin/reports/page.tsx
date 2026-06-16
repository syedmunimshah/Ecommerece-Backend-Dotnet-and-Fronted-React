import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Reports" };
export default function Page() {
  return <AdminPlaceholder title="Reports" description="Generate and export business reports." />;
}
