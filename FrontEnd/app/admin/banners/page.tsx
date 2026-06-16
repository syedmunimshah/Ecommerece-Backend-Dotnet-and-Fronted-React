import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Banners" };
export default function Page() {
  return <AdminPlaceholder title="Banner Management" description="Manage homepage banners and promotional slides." />;
}
