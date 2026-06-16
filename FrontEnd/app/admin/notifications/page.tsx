import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Notifications" };
export default function Page() {
  return <AdminPlaceholder title="Admin Notifications" description="System alerts and admin notifications." />;
}
