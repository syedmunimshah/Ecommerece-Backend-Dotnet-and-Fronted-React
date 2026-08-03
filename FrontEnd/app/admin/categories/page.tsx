"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/store/api/api";
import { asArray } from "@/lib/utils/paged";
import type { CategoryDto } from "@/lib/types/api";

export default function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [newName, setNewName] = useState("");

  const categories = asArray<CategoryDto>(data);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategory({ name: newName.trim() }).unwrap();
    setNewName("");
    refetch();
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />
      <PageHeader title="Categories" subtitle="Create and manage product categories" />

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : isError ? (
        <p className="text-muted">Could not load categories.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-border bg-[var(--card-bg)] p-4"
            >
              <input
                defaultValue={cat.name}
                onBlur={(e) => {
                  if (e.target.value !== cat.name) {
                    updateCategory({ id: cat.id, name: e.target.value, isActive: cat.isActive });
                  }
                }}
                className="flex-1 bg-transparent font-medium outline-none"
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    defaultChecked={cat.isActive}
                    onChange={(e) =>
                      updateCategory({ id: cat.id, name: cat.name, isActive: e.target.checked })
                    }
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="text-muted hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
