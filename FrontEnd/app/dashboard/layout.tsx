import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { getServerUser } from "@/lib/jwt";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar role={user?.role ?? null} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
