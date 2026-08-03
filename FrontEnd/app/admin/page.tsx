"use client";

import Link from "next/link";
import { Users, Store, ShoppingBag, FolderTree } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetAdminUsersQuery,
  useGetPendingSellersQuery,
  useGetAllOrdersQuery,
  useGetCategoriesQuery,
} from "@/lib/store/api/api";
import { useRoleApiSkip } from "@/lib/hooks/useRoleApiSkip";
import { asArray } from "@/lib/utils/paged";
import type { CategoryDto } from "@/lib/types/api";

export default function AdminOverviewPage() {
  const { skipAdminApi } = useRoleApiSkip();
  const { data: usersData } = useGetAdminUsersQuery(
    { pageNumber: 1, pageSize: 1 },
    { skip: skipAdminApi },
  );
  const { data: pendingData } = useGetPendingSellersQuery(undefined, { skip: skipAdminApi });
  const { data: ordersData } = useGetAllOrdersQuery(
    { pageNumber: 1, pageSize: 1 },
    { skip: skipAdminApi },
  );
  const { data: categoriesData } = useGetCategoriesQuery();

  const stats = [
    {
      label: "Total Users",
      value: usersData?.totalRecords ?? "—",
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Pending Sellers",
      value: asArray(pendingData).length,
      icon: Store,
      href: "/admin/sellers",
    },
    {
      label: "Total Orders",
      value: ordersData?.totalRecords ?? "—",
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      label: "Categories",
      value: asArray<CategoryDto>(categoriesData).length,
      icon: FolderTree,
      href: "/admin/categories",
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Admin" }]} />
      <PageHeader title="Admin Dashboard" subtitle="Manage users, sellers, categories & orders" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-border bg-[var(--card-bg)] p-5 transition-shadow hover:shadow-md"
          >
            <Icon className="h-5 w-5 text-orange-500" />
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
