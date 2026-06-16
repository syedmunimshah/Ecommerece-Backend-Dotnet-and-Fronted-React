import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Role Management" };
export default function Page() {
  return <AdminPlaceholder title="Role Management" description="Manage user roles via /api/role endpoints." />;
}
