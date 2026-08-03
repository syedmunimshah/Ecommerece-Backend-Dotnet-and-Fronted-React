"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed={["Admin"]}>
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </RoleGuard>
  );
}
