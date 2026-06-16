import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Settings" };
export default function Page() {
  return <AdminPlaceholder title="Settings" description="Configure store settings and preferences." />;
}
