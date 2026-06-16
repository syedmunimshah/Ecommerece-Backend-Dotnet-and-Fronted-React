import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Activity Logs" };
export default function Page() {
  return <AdminPlaceholder title="Activity Logs" description="Audit trail of admin and system actions." />;
}
