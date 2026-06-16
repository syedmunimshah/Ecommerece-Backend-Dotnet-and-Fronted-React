import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Brand Management" };
export default function Page() {
  return <AdminPlaceholder title="Brand Management" description="Manage seller brands and storefronts." />;
}
