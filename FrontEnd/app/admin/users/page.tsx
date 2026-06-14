import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listUsers } from "@/services/auth.service";
import { UsersManager } from "@/features/admin/UsersManager";
import { Pagination } from "@/components/ui/Pagination";

export const metadata: Metadata = { title: "Users" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number(page));
  const res = await listUsers(token, pageNum, 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-muted">{res.TotalRecords} total</span>
      </div>

      <UsersManager initialUsers={res.Data} />

      <Suspense>
        <Pagination page={pageNum} pageSize={15} total={res.TotalRecords} />
      </Suspense>
    </div>
  );
}
