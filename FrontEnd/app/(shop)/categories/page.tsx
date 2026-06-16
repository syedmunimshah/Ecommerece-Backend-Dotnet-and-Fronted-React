import type { Metadata } from "next";
import { listCategories } from "@/services/category.service";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { safeApi, emptyPaged } from "@/lib/safeApi";
import { BackendOfflineBanner } from "@/components/home/BackendOfflineBanner";
import { isBackendOnline } from "@/lib/health";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const backendOnline = await isBackendOnline();
  const { Data: categories } = await safeApi(() => listCategories(1, 100), emptyPaged());

  return (
    <div className="container-page py-10">
      {!backendOnline && <BackendOfflineBanner />}
      <Breadcrumb items={[{ label: "Categories" }]} />
      <h1 className="mb-2 text-3xl font-bold">All Categories</h1>
      <p className="mb-8 text-muted">Browse products by category</p>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.filter((c) => c.IsActive).map((c, i) => (
            <CategoryCard key={c.Id} category={c} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No categories available yet. Start the backend API to load data.</p>
      )}
    </div>
  );
}
