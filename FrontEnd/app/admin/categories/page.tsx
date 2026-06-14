import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser, getServerToken } from "@/lib/jwt";
import { listCategories } from "@/services/category.service";
import { CategoriesManager } from "@/features/admin/CategoriesManager";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const user = await getServerUser();
  if (!user || user.role !== "Admin") redirect("/");

  const token = (await getServerToken())!;
  const res = await listCategories(1, 100, token);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>
      <CategoriesManager initialCategories={res.Data} />
    </div>
  );
}
