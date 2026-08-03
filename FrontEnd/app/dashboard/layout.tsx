import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
